/**
 * Simulates an OR gate in JavaScript. As an io object this can be used to
 * chain together logic operators and objects
 *
 * @author David North
 */
function orGate()
{
    orGate.prototype.constructor.call(this);

    /**
     * Overrides the setState method of the parent so that the state may only
     * be changed to false if all inputs are also set to false. If even a single
     * input is true then the state is true
     *
     * @param boolean state The state to attempt to change to
     *
     * @return orGate
     */
    this.setState = function( state ){
        state = false;

        //Keep the state at false unless a true value is found
        for( var i = 0; i < this.getInputs().length; i++ )
        {
            if ( this.getInputs()[i].getState() )
            {
                state = true;
                break;
            }
        }

        //Update the state using the parent setState method
        return orGate.prototype.setState.call(this, state);
    }
}

//Set the parent of the orGate to io
include_once(['lib/io.js']);
orGate.prototype =  new io();
