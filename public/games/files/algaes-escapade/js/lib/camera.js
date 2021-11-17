/**
 * Represents the a camera, which is capable of panning around the world
 *
 * @author David North
 */
function camera( world )
{
    //The maximum speed that the camera can move at
    const MAX_VELOCITY = 300;

    /**
     * @var world The world that is being looked at
     */
    var _world = world;

    /**
     * @var boolean|gamejs.Rect Whether or not the camera is currently
     * tracking an object. This variable contains the object being tracked if so.
     */
    var _track = false;

    /**
     * @var boolean Whether or not the camera is animating to position
     */
    var _animating = false;

    /**
     * @var gamejs.Rect The size and position of the viewport
     * (what the player can see)
     */
    var _viewport  = new gamejs.Rect([0, 0], [0, 0]);

    /**
     * Sets the width of the viewport
     *
     * @param float width
     *
     * @return camera
     */
    this.setWidth = function( width ){
        if ( typeof(width) != 'number' )
        {
            throw 'Width must be a number';
        }

        _viewport.width = width;
        return this;
    }

    /**
     * Sets the height of the viewport
     *
     * @param float height
     *
     * @return camera
     */
    this.setHeight = function( height ){
        if ( typeof(height) != 'number' )
        {
            throw 'Height must be a number';
        }

        _viewport.height = height;
        return this;
    }

    /**
     * Sets the new position of the camera. Sanatises the position so that it
     * never looks outside of the world
     *
     * @param float x
     * @param float y
     *
     * @return camera
     */
    this.setPosition = function( x, y ){
        if ( typeof(x) != 'number' )
        {
            throw 'X position must be a number';
        }

        if ( typeof(y) != 'number' )
        {
            throw 'Y position must be a number';
        }

        //Get the last position that the camera was at before being moved
        var oldX = _viewport.x;
        var oldY = _viewport.y;

        //Sanitise the position and set the camera
        var newPosition = _getSanatisedPosition(x, y);
        _viewport.x = newPosition.x;
        _viewport.y = newPosition.y;

        //Update the objects in the world (i.e. shift them, the number of pixels
        //the camera has 'moved', giving the impression of movement)
        _updateObjects((_viewport.x - oldX), (_viewport.y - oldY));

        return this;
    }

    /**
     * Whether or not the camera is currently animating towards an object
     *
     * @return boolean
     */
    this.isAnimating = function(){
        return _animating;
    }

    /**
     * Focuses the camera on a rectangle, with the option to track it
     * continuously and to animate the movement
     *
     * @param gamejs.Rect rect The rectangle to focus on
     * @param boolean track Optional. Whether to track the object continuously
     * @param boolean animate Optional. Whether to animate the camera or not
     *
     * @return camera
     */
    this.focusOn = function( rect, track, animate ){
        //Mmmmm.. type hinting
        if ( !(rect instanceof gamejs.Rect) )
        {
            throw 'Rectangle must be an instance of gamejs.Rect';
        }

        //If track is not defined, then set the default value to false.
        //Otherwise, ensure that it's a boolean
        if (typeof(track) === "undefined")
        {
            track = false;
        }
        else if ( typeof(track) !== 'boolean' )
        {
            throw 'Optional track flag must be a boolean';
        }

        //If animate is not defined, then set the default value to false.
        //Otherwise, ensure that it's a boolean
        if (typeof(animate) === "undefined")
        {
            animate = false;
        }
        else if ( typeof(animate) !== 'boolean' )
        {
            throw 'Optional animate flag must be a boolean';
        }

        //The new Camera position should have the middle of the camera pointing
        //at the middle of the rectangle
        var newCameraX = rect.center[0] - (_viewport.width / 2);
        var newCameraY = rect.center[1] - (_viewport.height / 2);

        //If we are contantly tracking this object, then set that here
        if ( track )
        {
            _track = rect;
        }
        else
        {
            _track = false;
        }

        //If we are animating, don't move the camera (let the update method
        //do it), otherwise set the position now
        if ( animate )
        {
            _animating = true;
        }
        else
        {
            this.setPosition( newCameraX, newCameraY );
        }

        return this;
    }

    /**
     * Updates the camera position if it is tracking and also moves the camera
     * animation if animating
     *
     * @param int msDuration
     */
    this.update = function( msDuration ){
        if ( _track )
        {
            //Get the new X and Y c-ordinates, so that the camera is focused
            //on the middle of the object
            var destinationX = _track.center[0] - (_viewport.width / 2);
            var destinationY = _track.center[1] - (_viewport.height / 2);

            destinationX += _viewport.x
            destinationY += _viewport.y

            //If the tracking is animated then get the next frame, before
            //setting the new position to that instead
            if ( _animating )
            {
                var pos = _getNextAnimatedPosition(
                    destinationX, destinationY, msDuration
                );

                destinationX = pos.x;
                destinationY = pos.y;
            }

            this.setPosition( destinationX, destinationY );
        }
    }

    /**
     * Ensures that the camera is not intersecting the level (i.e. going over
     * the bounding box). This is so that the camera is always focused on
     * objects inside the level, not outside it
     *
     * @param float x The proposed X position
     * @param float y The proposed Y position
     *
     * @return object An object containing the x and y position
     */
    var _getSanatisedPosition = function( x, y ){
        var position = { 'x': x, 'y': y };
        var level    = _world.getBoundingRect();

        //Set up the collision test object (essentially a copy of the cameras
        //viewport, with the new x and y co-ordinates)
        var collideTest = new gamejs.Rect(
            [x, y], [_viewport.width, _viewport.height]
        );

        //Set up the edges of trhe level to test collisions on
        var rightEdge = [
            [level.right, level.top],
            [level.right, level.bottom]
        ];

        var leftEdge = [
            [level.left, level.top],
            [level.left, level.bottom]
        ];

        var topEdge = [
            [level.left, level.top],
            [level.right, level.top]
        ];

        var bottomEdge = [
            [level.left, level.bottom],
            [level.right, level.bottom]
        ];

        //Test the left and right edges, setting as appropriate
        if ( collideTest.collideLine(rightEdge[0], rightEdge[1]) )
        {
            position['x'] = level.right - collideTest.width;
        }
        else if ( collideTest.collideLine(leftEdge[0], leftEdge[1]) )
        {
            position['x'] = level.left;
        }

        //Test the top and bottom edges, setting as appropriate
        if ( collideTest.collideLine( topEdge[0], topEdge[1]) )
        {
            position['y'] = level.top;
        }
        else if ( collideTest.collideLine(bottomEdge[0], bottomEdge[1]) )
        {
            position['y'] = (level.bottom - collideTest.height);
        }

        return position;
    }

    /**
     * Gets the next frame for the camera animation
     *
     * @param float destinationX The target destination X position
     * @param float destinationY Tha target destination Y position
     * @param int msDuration The amount of time that has passed since the
     * last frame
     *
     * @return object An object containing the new X and Y
     */
    var _getNextAnimatedPosition = function(
        destinationX, destinationY, msDuration
    ){
        //Make sure that the new destination is not outside the world
        var sanePosition = _getSanatisedPosition(destinationX, destinationY);

        var position  = { 'x': sanePosition.x, 'y': sanePosition.y };

        var targetX   = position.x;
        var targetY   = position.y;
        var deltaX    = _viewport.x - targetX;
        var deltaY    = _viewport.y - targetY;
        var velocityX = velocityY = MAX_VELOCITY;

        //If the delta Y is zero, then the velocity is zero as the camera is
        //not moving anywhere along the Y axis
        if ( 0 === deltaY )
        {
            velocityY = 0;
        }

        //If the delta X is zero, then the velocity is zero as the camera is
        //not moving anywhere along the X axis
        if ( 0 === deltaX )
        {
            velocityX = 0;
        }

        //Find out if the difference on the X or Y axis is bigger and slow
        //down the smaller of the two. This gives a nice diagonal effect so
        //that the camera doesn't look like it's panning around trying to find
        //the object
        if ( Math.abs(deltaX) > Math.abs(deltaY) )
        {
            if ( 0 != deltaY )
            {
                velocityY *= (deltaX / deltaY);
            }
        }
        else if ( Math.abs(deltaX) < Math.abs(deltaY) )
        {
            if ( 0 != deltaX )
            {
                velocityX *= (deltaX / deltaY);
            }
        }

        //A small delta X means that the camera needs to move to the right, and
        //a large delta means to move it to the left
        if ( deltaX < 0 )
        {
            position.x = _viewport.x + ( velocityX * (msDuration / 1000) );
        }
        else
        {
            position.x = _viewport.x - ( velocityX * (msDuration / 1000) );
        }

        //A small delta X means that the camera needs to move down, and
        //a large delta means to move it up
        if ( deltaY < 0 )
        {
            position.y = _viewport.y + ( velocityY * (msDuration / 1000) );
        }
        else if ( deltaY < 0 )
        {
            position.y = _viewport.y - ( velocityY * (msDuration / 1000) );
        }


        //Check to see if the camera is close to the target. If it is, then move
        //it to the target so that on the next frame it doesn't overshoot
        if ( position.x <= (targetX + 5) && position.x >= (targetX - 5) )
        {
            position.x = targetX;
        }

        if ( position.y <= (targetY + 5) && position.y >= (targetY - 5) )
        {
            position.y = targetY;
        }

        //If the camera has reached it's target, then stop it animating
        if ( targetX == position.x && targetY == position.y )
        {
            _animating = false;
        }

        return position;
    }

    /**
     * Updates all objects with their new position. This gives the illusion that
     * the camera has moved, when in reality it's all the objects that
     * have moved
     *
     * @param float distanceX The distance the camera has travelled on the X
     * @param float distanceY The distance the camera has travelled on the Y
     */
    var _updateObjects = function( distanceX, distanceY ){
        var objects = _world.getObjects();
        for ( var i = 0; i < objects.length; i++)
        {
            objects[i].forEach(function(obj){
                obj.rect.x -= distanceX;
                obj.rect.y -= distanceY;
            });
        }
    }
}