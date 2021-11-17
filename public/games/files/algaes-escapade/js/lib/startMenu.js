
include_once(['lib/world.js', 'lib/menu.js','lib/menuItem.js'])
function startMenu()
{
    var _menu = new menu();
    _menu.setPosition(260, 500)
    _menu.addItem( new menuItem('img/new-game.png') );

    var _bg    = gamejs.image.load('img/splash-screen.png');
    var _world = null;

    var _setupLevel = function( mainSurface ){
        //Initiate the world amd set the level to a reset
        _world          = new world();
        var lvlNum      = 0;
        var self        = this;

        var nextLevel = function(event){
            if ( typeof(event) !== 'undefined' )
            {
                event.preventDefault();
            }

            if ( $('#game_scorecard .nextLevel').hasClass('disabled') )
            {
                return false;
            }

            lvlNum++;

            resetLevel();
            return false;
        };

        var resetLevel = function(event){
            if ( typeof(event) !== 'undefined' )
            {
                event.preventDefault();
            }

            $('#game_scorecard_bg').hide();

            _world.init(lvlNum, mainSurface);
            return false;
        }

        var backToMenu = function(event){
            if ( typeof(event) !== 'undefined' )
            {
                event.preventDefault();
            }

            _world = null;
            $('#game_scorecard_bg').remove();
            return false;
        }

        $('.nextLevel').die();
        $('.resetLevel').die();
        $('.mainMenu').die();

        $('.nextLevel').live('click', nextLevel);
        $('.resetLevel').live('click', resetLevel);
        $('.mainMenu').live('click', backToMenu);

        //Initialise the first level
        nextLevel();
    }

    this.handleInput = function( mainSurface ){
        if ( _world === null )
        {
            gamejs.event.get().forEach(function(event){
                if ( event.type === gamejs.event.KEY_DOWN )
                {
                    if ( event.key == gamejs.event.K_ENTER )
                    {
                        _setupLevel( mainSurface );
                    }
                }
            });
        }
        else
        {
            _world.handleInput();
        }
    }

    this.update = function( msDuration ){
        if ( _world !== null )
        {
            _world.update( msDuration );
        }
    }

    this.draw = function( surface ){
        if ( _world === null )
        {
            surface.blit(_bg);
            _menu.draw( surface );
        }
        else
        {
            _world.draw( surface );
        }
    }
}