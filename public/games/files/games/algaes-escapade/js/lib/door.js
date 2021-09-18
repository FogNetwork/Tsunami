/**
 * Represents a door which can be passed only when the state is set to true
 *
 * @author David North
 */
function door()
{
    door.prototype.constructor.call(this);

    //Set up the variables required by the sprite inheritance
    this.image = gamejs.image.load('img/door.png');
    this.image.crop( new gamejs.Rect( [0,0], [83,466] ));

    var _size = this.image.getSize();
    this.rect = new gamejs.Rect([0, 0], [_size[0], _size[1]]);

    /**
     * Overrides the setState method of the parent so that the object changes
     * depending on whether it is on or off
     *
     * @param boolean state The state to apply
     *
     * @return door
     */
    this.setState = function( state ){
        //Only update if the state has actually changed
        if ( state != this.getState() )
        {
            if ( state )
            {
                this.image.crop( new gamejs.Rect( [83,0], [83,466] ));
            }
            else
            {
                this.image.crop( new gamejs.Rect( [0,0], [83,466] ));
            }
        }

        //Update the state using the parent setState method
        return door.prototype.setState.call(this, state);
    }

    /**
     * Handles the collision between a playable and this object
     *
     * @return door
     */
    this.handleCollision = function( playable ){

        if ( !this.getState() )
        {
            //Modify the rectangle. The player shouldn't hit the door
            //until they are at the beam
            var targetX  = this.rect.x + 26;
            var targetY  = this.rect.y; 

            var targetWidth  = this.rect.width - 52;
            var targetHeight = this.rect.height;

            var rect = new gamejs.Rect(
                [targetX, targetY], [targetWidth, targetHeight]
            );

            playerCollides(playable, rect);
        }

        return this;
    }
}

//Set the parent of the door to io
include_once(['lib/io.js']);
door.prototype =  new io();
