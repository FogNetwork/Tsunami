
function tooltip()
{
    //Load the variables required by gamejs.sprite.Sprite
    tooltip.superConstructor.apply(this, [0, 0]);
    this.image = gamejs.image.load('img/blank.png');
    this.rect  = new gamejs.Rect([0, 0]);

    if ( !($('#game_tooltip').length) )
    {
        $('#gameWindow').append('<div id="game_tooltip"></div>');
    }

    var _text = '';

    this.setDimensions = function(width, height){
        this.rect.width  = width;
        this.rect.height = height;
    }

    this.setPosition = function(x, y){
        this.rect.x = x;
        this.rect.y = y;
    }

    this.setText = function( text ){
        _text = text;
    }

    this.show = function(){
        $('#game_tooltip').html(_text);
        $('#game_tooltip').fadeIn();

        if ( null != tooltip.timer )
        {
            clearInterval(tooltip.timer);
            tooltip.timer = null;
        }

        tooltip.timer = setTimeout(this.hide, 5000)
    }

    this.hide = function(animate){
        if ( typeof(animate) == 'undefined' )
        {
            animate = true;
        }

        if ( animate )
        {
            $('#game_tooltip').fadeOut();
        }
        else
        {
            $('#game_tooltip').hide();
        }


        tooltip.timer = null;
    }

    this.handleCollision = function( playable, isCurrentPlayer){
        if ( isCurrentPlayer )
        {
            this.show();
        }
    }

    this.draw = function(){
        return null;
    }
}

//Set a static variable, so that we can keep track of when to hide tooltips
tooltip.timer = null;

//Extend the playable object so that the parent is the sprite
gamejs.utils.objects.extend(tooltip, gamejs.sprite.Sprite);