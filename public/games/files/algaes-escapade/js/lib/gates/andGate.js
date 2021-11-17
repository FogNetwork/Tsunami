/**
 * Simulates an AND gate in JavaScript. As an io object this can be used to
 * chain together logic operators and objects
 *
 * @author David North
 */
function andGate()
{
    andGate.prototype.constructor.call(this);

    /**
     * Overrides the setState method of the parent so that the state may only
     * be changed to true if all inputs are also set to true
     *
     * @param boolean state The state to attempt to change to
     *
     * @return andGate
     */
    this.setState = function( state ){
        state = true;

        //Keep the state at true unless a false value is found
        for( var i = 0; i < this.getInputs().length; i++ )
        {
            if ( !(this.getInputs()[i].getState()) )
            {
                state = false;
                break;
            }
        }

        //Update the state using the parent setState method
        return andGate.prototype.setState.call(this, state);
    }
}

//Set the parent of the andGate to io
include_once(['lib/io.js']);
andGate.prototype =  new io();
