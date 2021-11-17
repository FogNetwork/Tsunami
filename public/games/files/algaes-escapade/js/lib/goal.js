/**
 * The end goal of the game. All of the goals present in the game need to be
 * active before the game is complete
 *
 * @author David North
 */
function goal()
{
    //Load the variables required by gamejs.sprite.Sprite
    goal.superConstructor.apply(this, [0, 0]);
    this.image = gamejs.image.load('img/goal.png');

    var _size = this.image.getSize();
    this.rect = new gamejs.Rect([0, 0], [_size[0], _size[1]]);

    /**
     * @var boolean Whether the goal has been activated
     */
    var _active = false;

    /**
     * Sets the position of the object
     *
     * @param float x The X co-ordinate
     * @param float y The Y co-ordinate
     *
     * @return goal
     */
    this.setPosition = function(x, y){
        this.rect.x = x;
        this.rect.y = y;

        return this;
    }

    /**
     * Returns whether or not the goal has been activated
     *
     * @return boolean
     */
    this.isActive = function(){
        return _active;
    }

    /**
     * Updates the object, ready for the next draw request
     *
     * @param msDuration
     *
     * @return goal
     */
    this.update = function(msDuration){
        //The default state for thisobject is deactivated, unless a
        //player has collided with it
        _active = false;

        return this;
    }

    /**
     * Handles the collision between a playable and this object
     *
     * @return goal
     */
    this.handleCollision = function( playable ){
        //Modify the rectangle. The player shouldn't end the level until
        //they are fully within the tube
        var targetX  = this.rect.x + (this.rect.width / 2);
        targetX     += (playable.rect.width / 2);

        var targetY  = this.rect.y; 
        var rect     = new gamejs.Rect([targetX, targetY], [40, 144]);

        //Check if the player has collided with this goal, and whether it
        //should be activated
        _active = playable.rect.collideRect(rect);

        return this;
    }
}

//Extend the playable object so that the parent is the sprite
gamejs.utils.objects.extend(goal, gamejs.sprite.Sprite);