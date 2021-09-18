/**
 * Simulates a NOT gate in JavaScript. As an io object this can be used to
 * chain together logic operators and objects
 *
 * @author David North
 */
function notGate()
{
    notGate.prototype.constructor.call(this);

    /**
     * Overrides the addInput method of the parent so that only a single
     * input can be added to this object. This is because the NOT gate can only
     * operate by setting itself to a modified state of it's single input
     *
     * @param io input The input to add
     *
     * @return io
     */
    this.addInput = function( input ){
        notGate.prototype.addInput.call(this, input);

        if ( this.getInputs().length > 1 )
        {
            throw 'You may only have one input assigned to a Not gate';
        }

        return this;
    }

    /**
     * Overrides the setState method of the parent so that the state that this
     * object is set to is the opposite to that provided
     *
     * @param boolean state The state to apply
     *
     * @return notGate
     */
    this.setState = function( state ){
        return notGate.prototype.setState.call(this, !state);
    }
}

//Set the parent of the notGate to io
include_once(['lib/io.js']);
notGate.prototype =  new io();
