/**
 * Represents a playable sprite. This is manipulated by the player object which
 * determines which playable should be modified
 *
 * @author David North
 */
function playable()
{
    //Load the variables required by gamejs.sprite.Sprite
    playable.superConstructor.apply(this, [0, 0]);
    this.image = gamejs.image.load('img/player.png');

    this.rect = new gamejs.Rect([0, 0]);

    /**
     * @var int The amount of health the playable has
     */
    var _health    = 100;

    /**
     * @var float The velocity left to right that the playable is experiencing
     */
    var _velocityX = 0.0;

    /**
     * @var float The velocity bottom to top that this playable is experiencing
     */
    var _velocityY = 0.0;

    /**
     * @var string How the player is currently moving (walk, jump, fall etc.)
     */
    var _moveType = '';

    /**
     * Sets how the player is currently moving, and generates the correct
     * sprite image
     *
     * @param string type The type of movement
     *
     * @return playable
     */
    this.setMovement = function( type ){
        //Only change the type if it has actually changed. No need to do any
        //processing otherwise
        if ( type != _moveType )
        {
            //Get the old size so that we can modify the X and Y co-ordinates
            //accordingly if the sprite changes height or width
            var oldSize = this.image.getSize();

            //Set the correct sprite image depending on the type of movement
            switch(type)
            {
                case 'walk':
                    this.image.crop( new gamejs.Rect([0,0], [46,55] ));
                    break;
                case 'jump':
                    this.image.crop( new gamejs.Rect([0,55], [46,69] ));
                    break;
                case 'fall':
                    this.image.crop( new gamejs.Rect([46,55], [46,69] ));
                    break;
            }

            //Get and set the new sizes
            var _size        = this.image.getSize();
            this.rect.width  = _size[0];
            this.rect.height = _size[1];

            //Set the new X and Y co-ordinates
            this.rect.x += oldSize[0] - _size[0];
            this.rect.y += oldSize[1] - _size[1];

            _moveType = type;
        }

        return this;
    }

    /**
     * Returns the current movement type of the playable
     *
     * @return string
     */
    this.getMovement = function(){
        return _moveType;
    }

    /**
     * Sets the position of the object
     *
     * @param float x The X co-ordinate
     * @param float y The Y co-ordinate
     *
     * @return playable
     */
    this.setPosition = function(x, y){
        this.setX(x);
        this.setY(y);

        return this;
    }

    /**
     * Sets the X value of the playable (useful when initiating a new playable,
     * teleporting, etc)
     *
     * @param float x
     *
     * @return playable
     */
    this.setX = function( x ){
        if ( typeof(x) != 'number')
        {
            throw 'Value for X must be a number';
        }

        this.rect.x = x;
        return this;
    }

    /**
     * Gets the current X position
     *
     * @return float
     */
    this.getX = function(){
        return this.rect.x;
    }

    /**
     * Sets the Y value of the playable (useful when initiating a new playable,
     * teleporting, etc)
     *
     * @param float y
     *
     * @return playable
     */
    this.setY = function( y ){
        if ( typeof(y) != 'number')
        {
            throw 'Value for Y must be a number';
        }

        this.rect.y = y;
        return this;
    }

    /**
     * Gets the current Y position
     *
     * @return float
     */
    this.getY = function(){
        return this.rect.y;
    }

    /**
     * Sets the velocity of the playable so that the speed in one way or
     * another can be set
     *
     * @param float x The velocity left to right
     * @param float y The velocity bottom to top
     *
     * @return playable
     */
    this.setVelocity = function( x, y ){
        if ( typeof(x) != 'number')
        {
            throw 'Value for X must be a number';
        }

        if ( typeof(y) != 'number')
        {
            throw 'Value for Y must be a number';
        }

        _velocityX = x;
        _velocityY = y;
        return this;
    }

    /**
     * Gets the X and Y velocity for this playable object by returning an object
     * with an x and y parameter
     *
     * @return object
     */
    this.getVelocity = function(){
        return { 'x':_velocityX, 'y':_velocityY };
    }

    /**
     * Updates the object, ready for the next draw request
     *
     * @param msDuration
     *
     * @return playable
     */
    this.update = function( msDuration ){
        //Set the default movement to wealking, if it hasn't already been set
        if ( this.getMovement() == '' )
        {
            this.setMovement('walk');
        }

        //If the player is falling then set that sprite up. Other movement
        //types are dealt with outside this object
        if ( this.getVelocity().y > 0 )
        {
            this.setMovement('fall');
        }

        //Calculate the distance the playable has moved since the last frame
        var distanceX = (this.getVelocity().x * (msDuration/1000));
        var distanceY = (this.getVelocity().y * (msDuration/1000));

        //Move the playable the calculated distance
        this.rect.moveIp( distanceX, distanceY );

        return this;
    }
}

//Extend the playable object so that the parent is the sprite
gamejs.utils.objects.extend(playable, gamejs.sprite.Sprite);
