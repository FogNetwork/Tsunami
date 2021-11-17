/**
 * Represents a block that the player may hit
 *
 * @author David North
 */
function block()
{
    //Load the variables required by gamejs.sprite.Sprite
    block.superConstructor.apply(this, [0, 0]);
    this.image = gamejs.image.load('img/blank.png');

    var _size = this.image.getSize();
    this.rect = new gamejs.Rect([0, 0], [800, 20]);

    /**
     * Sets the position of the object
     *
     * @param float x The X co-ordinate
     * @param float y The Y co-ordinate
     *
     * @return block
     */
    this.setPosition = function(x, y){
        if ( typeof(x) !== 'number' )
        {
            throw 'X must be a number';
        }

        if ( typeof(y) !== 'number' )
        {
            throw 'Y must be a number';
        }

        this.rect.x = x;
        this.rect.y = y;

        return this;
    }

    /**
     * Returns the position of the object
     *
     * @return object Contains an x and y property
     */
    this.getPosition = function(){
        return {"x": this.rect.x, "y": this.rect.y};
    }

    /**
     * Handles the collision between a playable and this object
     *
     * @return block
     */
    this.handleCollision = function( playable ){
        playerCollides(playable, this.rect);

        return this;
    }
}

//Extend the playable object so that the parent is the sprite
gamejs.utils.objects.extend(block, gamejs.sprite.Sprite);