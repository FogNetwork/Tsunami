
include_once(['lib/menuItem.js'])
function menu()
{
    var _items         = [];
    var _currentActive = 0;
    var _x             = 0;
    var _y             = 0;

    this.setPosition = function(x, y)
    {
        if ( typeof(x) != 'number' )
        {
            throw 'X position must be a number';
        }

        if ( typeof(y) != 'number' )
        {
            throw 'Y position must be a number';
        }

        _x = x;
        _y = y;
        return this;
    }

    this.addItem = function( mItem ){
        if ( !(mItem instanceof menuItem) )
        {
            throw 'Argument must be of type menuItem';
        }

        if ( _items.length === 0 )
        {
            mItem.setActive(true);
        }

        _items.push(mItem);
        return this;
    }

    this.activate = function(index){
        for( var i = 0; i < _items; i++ )
        {
            if ( i != index )
            {
                _items[i].setActive(false);
            }
            else
            {
                _items[i].setActive(true);
            }
        }
    }

    this.activateNext = function(){
        _currentActive++;

        if ( _currentActive >= _items.length )
        {
            _currentActive = 0;
        }

        return this.activate(_currentActive);
    }

    this.draw = function( surface ){
        var dest = new gamejs.Rect([_x, _y]);

        for( var i = 0; i < _items.length; i++ )
        {
            surface.blit( _items[i].getCanvas(), dest );
            dest.y += 30;
        }
    }
}