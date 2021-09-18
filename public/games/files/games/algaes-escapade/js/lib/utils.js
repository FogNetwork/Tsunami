function include_once(includes)
{
    if ( typeof($('head').data('included')) == 'undefined' )
    {
        $('head').data('included', []);
    }

    for ( var i = 0; i < includes.length; i++ )
    {
        if ( $.inArray(includes[i], $('head').data('included')) === -1 )
        {
            $('head').append(
                '<script type="text/javascript" src="js/'+includes[i]+'"></script>'
            );

            $('head').data('included').push(includes[i]);
        }
    }
}

function playerCollides(playable, rect, drag)
{
    if ( typeof(drag) == 'undefined' )
    {
        drag = 50;
    }

    //Define the top edge (left to right, along the top of the
    //colliding block)
    var topEdge = [ [rect.left, rect.top], [rect.right, rect.top] ];

    //Define the top edge (left to right, along the bottom of the
    //colliding this)
    var bottomEdge = [ [rect.left, rect.bottom], [rect.right, rect.bottom] ];

    //Define the left edge (top to bottom, along the left of the
    //colliding this)
    var leftEdge = [ [rect.left, rect.top], [rect.left, rect.bottom] ];

    //Define the right edge (top to bottom, along the right of the
    //colliding this)
    var rightEdge = [ [rect.right, rect.top], [rect.right, rect.bottom] ];

    //Check the top and bottom colliision points. If a collision is
    //detected then set the velocity on the Y axis to zero and move
    //the playable so that it is no longer colliding
    if ( playable.rect.collideLine(topEdge[0], topEdge[1]) )
    {
        var newX = playable.getVelocity().x;
        if (newX < 0 )
        {
            newX += drag;
        }
        else if ( newX > 0 )
        {
            newX -= drag;
        }
        playable.setVelocity( newX, 0 );
        playable.rect.bottom = (rect.top - 0.01);
        playable.setMovement('walk');
    }
    else if ( playable.rect.collideLine(bottomEdge[0], bottomEdge[1]) )
    {
        playable.setVelocity( playable.getVelocity().x, 0 );
        playable.rect.top = (rect.bottom + 0.01);
    }

    //Check the left and right colliision points. If a collision is
    //detected then set the velocity on the X axis to zero and move
    //the playable so that it is no longer colliding
    if ( playable.rect.collideLine(leftEdge[0], leftEdge[1]) )
    {
        playable.setVelocity( 0, playable.getVelocity().y );
        playable.rect.right = (rect.left - 0.01);

    }
    else if ( playable.rect.collideLine(rightEdge[0], rightEdge[1]) )
    {
        playable.setVelocity( 0, playable.getVelocity().y );
        playable.rect.left = (rect.right + 0.01);
    }
}