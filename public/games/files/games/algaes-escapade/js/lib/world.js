/**
 * Represents the game world, containing the game logic and sprites that
 * require rendering
 *
 * @author David North
 */
 include_once(['lib/camera.js','lib/player.js', 'lib/scorecard.js',
    'lib/lever.js', 'lib/door.js', 'lib/gates/andGate.js',
    'lib/gates/orGate.js', 'lib/gates/notGate.js', 'lib/block.js',
    'lib/goal.js', 'lib/tooltip.js', 'lib/platform.js']);
function world()
{
    //The maximum X velocity a player can trvel (heading right)
    const MAX_X_VELOCITY = 200;

    //The maximum Y velocity a player can trvel (heading down)
    const MAX_Y_VELOCITY = 400;

    //The minimum X velocity a player can trvel (heading left)
    const MIN_X_VELOCITY = -250;

    //The minimum Y velocity a player can trvel (heading up)
    const MIN_Y_VELOCITY = -350;

    /**
     * @var boolean Whether the world has fully loaded
     */
    var _hasLoaded;

    var _levelComplete;

    var _gameTime;

    var _scorecard;

    /**
     * @var camera The camera to use
     */
    var _camera;

    /**
     * @var gamejs.sprite.Sprite Represents the bounding box (and background)
     * of a level
     */
    var _levelSprite;

    var _levelRect;

    /**
     * @var player Represents the player
     */
    var _p;

    /**
     * @var gamejs.sprite.Group Represents all objects a player can
     * interact with
     */
    var _objects;

    var _goals;

    _levelSpriteCollission = function(playable){
        var rightEdge = [
            [this.rect.right, this.rect.top],
            [this.rect.right, this.rect.bottom]
        ];

        var leftEdge = [
            [this.rect.left, this.rect.top],
            [this.rect.left, this.rect.bottom]
        ];

        var topEdge = [
            [this.rect.left, this.rect.top],
            [this.rect.right, this.rect.top]
        ];

        var bottomEdge = [
            [this.rect.left, this.rect.bottom],
            [this.rect.right, this.rect.bottom]
        ];

        //Test the left and right edges, setting as appropriate
        if ( playable.rect.collideLine(rightEdge[0], rightEdge[1]) )
        {
            playable.rect.right = this.rect.right;
        }
        else if ( playable.rect.collideLine(leftEdge[0], leftEdge[1]) )
        {
            playable.rect.left = this.rect.left;
        }

        //Test the top and bottom edges, setting as appropriate
        if ( playable.rect.collideLine( topEdge[0], topEdge[1]) )
        {
            playable.rect.top = this.rect.top;
        }
        else if ( playable.rect.collideLine(bottomEdge[0], bottomEdge[1]) )
        {
            playable.rect.bottom = this.rect.bottom;
        }
    }

    /**
     * Main initiation method. Must be called before using the object
     *
     * @param object mainSurface the surface that everything will be drawn to
     *
     * @return world
     */
    this.init = function( levelNum, mainSurface )
    {
        this.clear();

        _levelSprite.image = gamejs.image.load('img/bg.png');

        var _size         = _levelSprite.image.getSize();
        _levelSprite.rect = new gamejs.Rect([0, 0], [_size[0], _size[1]]);
        _levelRect        = new gamejs.Rect([0, 0], [_size[0], _size[1]]);

        _objects.add(_levelSprite);

        _camera.setWidth( mainSurface.getSize()[0] );
        _camera.setHeight( mainSurface.getSize()[1] );

        $.ajax({
            "url": "js/lib/levels/level_"+levelNum+".js",
            "dataType": "json",
            "success": function(data){
                _loadLevel(data);
                _camera.focusOn(_p.getCurrentPlayable().rect, true);
                _hasLoaded = true;
            },
            "error": function(jqXHR, textStatus, errorThrown){
                throw errorThrown;
            }
        });

        return this;
    }

    this.clear = function(){
        if ( _objects instanceof  gamejs.sprite.Group )
        {
            while( _objects.sprites().length )
            {
                var sprite = _objects.sprites()[0];

                if ( typeof(sprite.hide) == 'function' )
                {
                    sprite.hide();
                }

                sprite.kill();
                sprite.remove(_objects);
            };
        }

        if ( _scorecard instanceof scorecard )
        {
            _scorecard.hide();
        }

        _hasLoaded     = false;
        _levelComplete = false;
        _gameTime      = 0;
        _scorecard     = new scorecard();
        _camera        = new camera( this );
        _levelSprite   = new gamejs.sprite.Sprite();
        _levelRect     = new gamejs.Rect([0,0]);
        _p             = new player();
        _objects       = new gamejs.sprite.Group();
        _goals         = [];

        _levelSprite.handleCollision = _levelSpriteCollission;
    }


    this.getBoundingRect = function()
    {
        return _levelRect;
    }

    this.getObjects = function()
    {
        return [ _p.getPlayables(), _objects ]
    }

    this.getPlayer = function()
    {
        return _p;
    }

    /**
     * Handles user input and modifies the world objects accordingly
     *
     * @return world
     */
    this.handleInput = function()
    {
        if ( _hasLoaded && !_camera.isAnimating())
        {
            var self = this;

            //Loop through each game event (key presses mouse movements etc)
            gamejs.event.get().forEach(function(event){
                if ( !_levelComplete )
                {
                    var _currentPlayer = _p.getCurrentPlayable();

                    _p.handleInput(event);

                    if ( _p.getCurrentPlayable() != _currentPlayer )
                    {
                        _camera.focusOn(
                            _p.getCurrentPlayable().rect, true, true
                        );
                    }

                    _objects.forEach(function(obj){
                        if ( typeof(obj.handleInput) == 'function' )
                        {
                            obj.handleInput(self, event);
                        }
                    });
                }
            });
        }

        return this;
    }

    /**
     * Updates all objects within the world
     *
     * @param int msDuration The amount of time since the last update
     *
     * @return world
     */
    this.update = function( msDuration )
    {
        if ( _hasLoaded && !_levelComplete )
        {
            _gameTime += msDuration;

            //Apply the gravitational pull of the world
            _applyGravity( msDuration );

            //Apply updates to the player and any objects in the world
            _p.update( msDuration );
            _objects.update( msDuration );

            var colliders =
                gamejs.sprite.groupCollide(_p.getPlayables(), _objects);

            for( var i = 0; i < colliders.length; i++ )
            {
                if ( typeof(colliders[i].b.handleCollision) == 'function' )
                {
                    var isCurrentPlayer = false;
                    if ( colliders[i].a === _p.getCurrentPlayable() )
                    {
                        isCurrentPlayer = true;
                    }

                    colliders[i].b.handleCollision(
                        colliders[i].a, isCurrentPlayer
                    );
                }
            }

            //Modify the camera position
            _camera.update ( msDuration );

            _levelComplete = true;
            for( var i = 0; i < _goals.length; i++ )
            {
                if ( !_goals[i].isActive() )
                {
                    _levelComplete = false;
                    break;
                }
            }

            if ( _levelComplete )
            {
                for( var i = 0; i < _objects.sprites().length; i++ )
                {
                    var obj = _objects.sprites()[i];
                    if ( obj instanceof tooltip )
                    {
                        obj.hide(false);
                    }
                }

                _scorecard.setTimeTaken(_gameTime / 1000);
                _scorecard.setClonesUsed(_p.getNumClones());
                _scorecard.show();
            }
        }

        return this;
    }

    /**
     * Draws all objects within the world
     *
     * @return this
     */
    this.draw = function ( mainSurface )
    {
        if ( _hasLoaded )
        {
            //Draw the level, collidables and non collidables, as these need
            //to be behind the player
            _objects.draw( mainSurface );

            //Draw the player at the forefront of the level
            _p.draw( mainSurface );
        }

        return this;
    }

    /**
     * Loads the level data from an array, filling the worls with collidables
     * and ensuring it's playable
     */
    var _loadLevel = function( data, input, output )
    {
        var _hasPlayer = false;
        for ( var i = 0; i < data.length; i ++)
        {
            if ( data[i]['type'] == 'stats' )
            {
                _scorecard.setParForClones(data[i]['clonePar']);
                _scorecard.setParForTime(data[i]['timePar']);

                if ( typeof(data[i]['lastLevel']) == 'boolean' )
                {
                    _scorecard.setLastLevel(data[i]['lastLevel']);
                }
                else
                {
                    _scorecard.setLastLevel(false);
                }
            }
            else
            {
                var xAmount = 1;
                var yAmount = 1;

                if ( typeof(data[i]['repeat-x']) != 'undefined')
                {
                    xAmount = data[i]['repeat-x'];
                }

                if ( typeof(data[i]['repeat-y']) != 'undefined')
                {
                    yAmount = data[i]['repeat-y'];
                }

                for ( var x = 0; x < xAmount; x++ )
                {
                    for ( var y = 0; y < yAmount; y++ )
                    {
                        _addObjectToWorld(data[i], x, y, input, output);
                    }
                }
            }
        }
    }

    var _addObjectToWorld = function( data, x, y, input, output ){
        var obj = null;

        if ( 'tooltip' == data['type'] )
        {
            obj = new tooltip();
            obj.setText(data['text']);
            _objects.add( obj );
        }
        else
        {
            switch ( data['type'] )
            {
                case 'block':
                case 'wall':
                    data['type'] = 'block';
                case 'andGate':
                case 'orGate':
                case 'notGate':
                case 'lever':
                case 'door':
                case 'goal':
                case 'platform':
                    var type = data['type'];
                    obj      = new window[type]();
                    _objects.add( obj );

                    if ( 'goal' === type )
                    {
                        _goals.push( obj );
                    }
                    break;

                case 'player':
                    obj = _p.getCurrentPlayable();
            }
        }

        if ( null != obj )
        {
            if ( obj instanceof io )
            {
                if ( typeof(data['outputs']) !== 'undefined' )
                {
                    _loadLevel(data['outputs'], obj);
                }

                if ( typeof(data['inputs']) !== 'undefined' )
                {
                    _loadLevel(data['inputs'], null, obj)
                }

                if ( typeof(input) !== 'undefined' && input != null )
                {
                    obj.addInput(input);
                }

                if ( typeof(output) !== 'undefined' && output != null )
                {
                    obj.addOutput(output);
                }
            }

            if ( typeof(obj.setDimensions) != 'undefined' )
            {
                if ( typeof(data['width']) != 'undefined'
                    && typeof(data['height']) != 'undefined' )
                {
                    obj.setDimensions(data['width'], data['height']);
                }
            }

            var width  = obj.rect.width;
            var height = obj.rect.height;

            var xPos = (data['x'] + (width * x));
            var yPos = (data['y'] + (height * y));

            obj.setPosition( xPos, yPos );
        }
    }

    /**
     * Applies the gravitational pull of the world on all playables
     */
    var _applyGravity = function( msDuration )
    {
        //Loop through each player and increase the Y velocity downward.
        //If the player is jumping, this has the affect of slowing the
        //player down. Otherwise the player is falling.
        _p.getPlayables().forEach(function(obj){
            var newVelocityY = obj.getVelocity().y
            newVelocityY += Math.round(0.3 * msDuration);

            obj.setVelocity( obj.getVelocity().x, newVelocityY )

            //the velocity cannot exceed the maximums, so ensuer that the player
            //is not falling too fast
            _sanatiseVelocity(obj);
        });
    }

    /**
     * Ensures that the player is not travelling too fast ion any direction
     */
    var _sanatiseVelocity = function(obj)
    {
        //Get the current Velocity
        var velocity = obj.getVelocity();

        //Make sure that the X velocity is not too slow or fast
        velocity.x = Math.max( MIN_X_VELOCITY, velocity.x );
        velocity.x = Math.min( MAX_X_VELOCITY, velocity.x );

        //Make sure that the Y velocity is not too slow or fast
        velocity.y = Math.max( MIN_Y_VELOCITY, velocity.y );
        velocity.y = Math.min( MAX_Y_VELOCITY, velocity.y );

        //Update the players velocity
        obj.setVelocity( velocity.x, velocity.y );
    }
}