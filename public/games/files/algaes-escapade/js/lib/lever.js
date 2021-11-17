/**
 * Represents a lever. Levers can be pulled and turned on or off, but must be
 * held down or they will revert to their off state
 *
 * @author David North
 */
function lever()
{
    lever.prototype.constructor.call(this);

    //Fulfil the requirements of the gamejs.sprite.Sprite object
    this.image = gamejs.image.load('img/switch.png');
    this.image.crop( new gamejs.Rect( [0,0], [83,43] ));

    var _size = this.image.getSize();

    /**
     * @var boolean Whether or the lever is being held down
     */
    var _heldDown = false;

    this.rect = new gamejs.Rect([0, 0], [_size[0], _size[1]]);

    /**
     * Overrides the setState method of the parent so that the object changes
     * depending on whether it is on or off
     *
     * @param boolean state The state to apply
     *
     * @return lever
     */
    this.setState = function( state ){
        if ( state != this.getState() )
        {
            if ( state )
            {
                this.image.crop( new gamejs.Rect( [83,0], [83,43] ));
            }
            else
            {
                this.image.crop( new gamejs.Rect( [0,0], [83,43] ));
            }
        }

        //Update the state using the parent setState method
        lever.prototype.setState.call(this, state);
    }

    /**
     * Updates the object, ready for the next draw request
     *
     * @param msDuration
     *
     * @return lever
     */
    this.update = function( msDuration ){
        //If the lever isn't held down then turn it off
        if ( !_heldDown )
        {
            this.setState(false);
        }

        //the default state is to be not held down, unless otherwise told
        _heldDown = false;

        return this;
    }

    /**
     * Handles the collision between a playable and this object
     *
     * @param playable playable The playable that collision has happened on
     *
     * @return lever
     */
    this.handleCollision = function( playable ){

        if ( _hasCollided(this, playable ) )
        {
            //If the player is colliding with this lever then it is held down
            _heldDown = true;
        }

        return this;
    }

    /**
     * Handles player input. If the player activates the switch then actions
     * may need to be taken
     *
     * @param world world The world this event came from
     * @param gamejs.Event event The event that fired
     */
    this.handleInput = function(world, event){
        var playable = world.getPlayer().getCurrentPlayable();

        //Only check the event if a key has been pushed and the player is
        //colliding with the lever
        if ( event.type === gamejs.event.KEY_DOWN
            && _hasCollided(this, playable) )
        {
            //If the key was 'enter' or 'e' then set the new state of the lever
            switch( event.key )
            {
                case gamejs.event.K_e:
                case gamejs.event.K_ENTER:
                    this.setState( !this.getState() );
                    break;
            }
        }
    }

    var _hasCollided = function ( self, playable )
    {
        var _collideRect = new gamejs.Rect(
            [self.rect.x + 34, self.rect.y],
            [32 , _size[1]]
        );

        return _collideRect.collideRect(playable.rect);
    }
}

//Set the parent of the lever to io
include_once(['lib/io.js']);
lever.prototype =  new io();
