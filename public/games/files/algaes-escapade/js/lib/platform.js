function platform()
{
    //Load the variables required by gamejs.sprite.Sprite
    platform.superConstructor.apply(this, [0, 0]);
    this.image = new gamejs.Surface([0,0]);

    var _size = this.image.getSize();
    this.rect = new gamejs.Rect([0, 0]);

    var _leftImg  = gamejs.image.load('img/platform-left.png');
    var _rightImg = gamejs.image.load('img/platform-right.png');
    var _midImg   = gamejs.image.load('img/platform-middle.png');

    this.setDimensions = function(width, height){
        this.rect.width  = width;
        this.rect.height = height;
    }

    this.setPosition = function(x, y){
        this.rect.x = x;
        this.rect.y = y;
    }

    this.draw = function( surface ){
        var rightSize = _rightImg.getSize();
        var leftSize = _leftImg.getSize();

        var rightSide = new gamejs.Rect(
                [(this.rect.right - rightSize[0]), this.rect.top],
                [rightSize[0], this.rect.height]
        );

        var leftSide  = new gamejs.Rect(
            [this.rect.left, this.rect.top],
            [leftSize[0], this.rect.height]
        );

        var middle = new gamejs.Rect(
            [(this.rect.left + leftSize[0]) , this.rect.top],
            [(rightSide.left - leftSide.right), this.rect.height]
        );

        surface.blit(_midImg, middle);
        surface.blit(_leftImg, leftSide);
        surface.blit(_rightImg, rightSide);
    }

    this.handleCollision = function(playable){
        var collider = new gamejs.Rect(
            [this.rect.x, this.rect.y + (this.rect.height / 2) ],
            [this.rect.width, this.rect.height / 2]
        );

        playerCollides(playable, collider);

        return this;
    }
}

//Extend the playable object so that the parent is the sprite
gamejs.utils.objects.extend(platform, gamejs.sprite.Sprite);