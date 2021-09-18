
function menuItem( image )
{
    if ( typeof(image) != 'string' )
    {
        throw 'Constructor argument must be text';
    }

    var _image    = gamejs.image.load(image);
    var _size     = _image.getSize();
    var _active   = false;
    var _callback = null;

    this.setActive = function( active ){
        if ( typeof(active) != 'boolean' )
        {
            throw 'Active flag must be boolean';
        }

        var rect = new gamejs.Rect([0,0],[parseInt(_size[0] / 2), _size[1]]);

        if ( active )
        {
            rect.x = parseInt(_size[0] / 2);
        }

        _image.crop(rect);
        _active = active;

        return this;
    }

    this.addCallback = function( callback ){
        if ( typeof(callback) !== 'function' )
        {
            throw 'Callback must be a function';
        }

        _callback = callback;
        return this;
    }

    this.setText = function( text ){
        if ( typeof(text) != 'string' )
        {
            throw 'Text argument must be text';
        }

        _text = text;
        return this;
    }

    this.getCanvas = function(){
        return _image;
    }
}