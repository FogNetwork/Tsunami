
function scorecard()
{
    var _clonePar = 0;

    var _timePar = 0;

    var _clones = 0;

    var _timeTaken = 0;

    var _lastLevel = false;

    if ( !($('#game_scorecard').length) )
    {
        $('#gameWindow').append('<div id="game_scorecard_bg"></div>');
        $('#game_scorecard_bg').append('<div id="game_scorecard"></div>');
        $('#game_scorecard').append('<h1>Results</h1>');
        $('#game_scorecard').append('<p>Number of Clones<span class="clones">0</span></p>');
        $('#game_scorecard').append('<p>Time<span class="time">0s</span></p>');
        $('#game_scorecard').append('<p class="scoreholder">Score<span class="score"></span></p>');
        $('#game_scorecard').append('<a class="mainMenu" href="#">Main Menu</a>');
        $('#game_scorecard').append('<a class="resetLevel" href="#">Reset Level</a>');
        $('#game_scorecard').append('<a class="nextLevel" href="#">Next Level</a>');
    }

    this.setParForClones = function( par ){
        _clonePar = par;
        return this;
    }

    this.setParForTime = function( par ){
        _timePar = par;
        return this;
    }

    this.setTimeTaken = function( time ){
        _timeTaken = time;
        return this;
    }

    this.setClonesUsed = function( clones ){
        _clones = clones;
        return this;
    }

    this.setLastLevel = function(last){
        _lastLevel = last;
        return this;
    }

    this.show = function(){
        $('#game_scorecard .clones').text(_clones);
        $('#game_scorecard .time').text(_calcTime());

        var score = 0;

        if ( _timeTaken <= (_timePar * 2) )
        {
            score++;
        }

        if ( _clones <= _clonePar )
        {
            score++;
        }

        if ( _timeTaken <= _timePar )
        {
            score++;
        }

        $('#game_scorecard .score .star').remove();

        for ( var i = 1; i <= 3; i++ )
        {
            var star = $('<div class="star"></div>');
            if ( score >= i )
            {
                star.addClass('enabled');
            }

            $('#game_scorecard .score').append(star);
        }

        if ( _lastLevel )
        {
            $('.nextLevel').on('click', function( event ){
                $('#game_scorecard_bg').hide();
                $('#gameEnd').fadeIn();

                $('body').on('keydown',function(event2){
                    switch ( event2.keyCode )
                    {
                        //Enter and e will all move to the next level
                        case 13:
                        case 69:
                            event2.preventDefault();
                            event2.stopImmediatePropagation();

                            $('#game_scorecard .mainMenu').click();
                            $('#gameEnd').fadeOut();
                            $(this).off();
                    }

                    return false;
                });

                $(this).off();
                event.preventDefault();
                event.stopImmediatePropagation();
            });
        }

        $('#game_scorecard_bg').fadeIn();
    }

    this.hide = function(){
        $('#game_scorecard_bg').fadeOut();
    }

    var _calcTime = function(){
        var seconds = parseInt(_timeTaken);
        var minutes = 0;
        var hours   = 0;
        var days    = 0;
        var ret     = '';

        if ( seconds > 60 )
        {
            minutes = Math.floor( seconds / 60 );
            seconds = (seconds % 60);

            if ( minutes >= 60 )
            {
                hours   = Math.floor( minutes / 60 );
                minutes = (minutes % 60);

                if ( hours >= 24 )
                {
                    days  = Math.floor( hours / 24 );
                    hours = (hours % 24);
                }
            }
        }

        if ( days )
        {
            ret = days+'d '+hours+'h';
        }
        else if ( hours )
        {
            ret = hours+'h '+minutes+'m';
        }
        else if ( minutes )
        {
            ret = minutes+'m '+seconds+'s';
        }
        else
        {
            ret = seconds+'s';
        }

        return ret;
    }

}