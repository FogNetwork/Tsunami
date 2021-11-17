gamejs = require('gamejs');
font   = require('gamejs/font');

//Preload all the required images
gamejs.preload([
    'img/splash-screen.png','img/new-game.png', 'img/bg.png','img/player.png',
    'img/blank.png','img/switch.png','img/door.png','img/goal.png',
    'img/platform-left.png','img/platform-right.png',
    'img/platform-middle.png', 'img/selected.png',
    'img/scorecard-background.png','img/game-window.png',
    'img/reset.png', 'img/star-off.png', 'img/star-on.png',
    'img/menu-button.png', 'img/next-button.png', 'img/end.png'
]);

gamejs.ready(function() {

    var display = gamejs.display.setMode([800, 600]);

    //Ensure that all required files are included
    include_once([
        'lib/startMenu.js'
    ]);

    var mainSurface = gamejs.display.getSurface();
    var mainWindow  = new startMenu();
    var self        = this;

    // msDuration = time since last tick() call
    var tick = function(msDuration){
        mainSurface.fill("#FFFFFF");

        //Handle user input
        mainWindow.handleInput( mainSurface );

        //Update the worlds objects
        mainWindow.update( msDuration );

        //Draw the new objects
        mainWindow.draw( mainSurface );
    };

    //Set up listeners for the body when a scorecard is present
    $('body').keydown(function(event){
        //Only check key presses if the scorcard is shown
        if ( $('#game_scorecard').is(":visible") )
        {
            switch ( event.keyCode )
            {
                //Enter and e will all move to the next level
                case 13:
                case 69:
                    $('#game_scorecard .nextLevel').click();
                    event.preventDefault();
                    break;
                //Escape will quit to the menu
                case 27:
                    $('#game_scorecard .mainMenu').click();
                    event.preventDefault();
                    break;
                //r will reset the level
                case 82:
                    $('#game_scorecard .resetLevel').click();
                    event.preventDefault();
                    break;
            }
        }
    });

    //Remove the loading bar
    $('#preload').remove();
    $('#gameWindow').show();

    //Set up the tick function, run at 60fps
    gamejs.time.fpsCallback(tick, self, 60);
});
