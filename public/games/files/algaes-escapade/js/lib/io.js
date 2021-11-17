/**
 * Basic input/output class. Listens for state changes on the inputs and
 * notifies outputs if a change happens
 *
 * @author David North
 */
function io()
{
    /**
     * @var boolean
     */
    this._state   = false;

    /**
     * @var array An array of inputs, that determine the state of this object
     */
    this._inputs  = [];

    /**
     * @var array An array of outputs, to send the state of this object to
     */
    this._outputs = [];

    //Load the variables required by gamejs.sprite.Sprite
    io.superConstructor.apply(this, [0, 0]);
    this.image = gamejs.image.load('img/blank.png');
    this.rect  = new gamejs.Rect([0,0]);

    /**
     * Sets the position of the object
     *
     * @param float x The X co-ordinate
     * @param float y The Y co-ordinate
     *
     * @return io
     */
    this.setPosition = function(x, y){
        this.rect.x = x;
        this.rect.y = y;
        return this;
    }

    /**
     * Private method fired when the state of the object has changed
     * (such as when a switch is pressed). Once the state has changed,
     * all other outputs need to be made aware of the change
     *
     * @return io
     */
    var _stateChange = function(obj){
        //Change the state of all outputs to the new state of this object,
        //effectively causing a knock-on affect down the chain
        for( var i = 0; i < obj.getOutputs().length; i++ )
        {
            obj.getOutputs()[i].setState( obj.getState() );
        }

        return this;
    };

    /**
     * Sets the state of this object
     *
     * @param boolean state The state to change to
     *
     * @return io
     */
    this.setState = function(state){
        if ( typeof(state) != 'boolean' )
        {
            throw 'State must be a boolean';
        }

        //Set the new state and set the state change event only if the state
        //has actually changed, otherwise we could waste time notifying objects
        ///that don't require notification
        if ( state != this.getState() )
        {
            this._state = state;
            _stateChange(this);
        }

        return this;
    };

    /**
     * Gets the state of the object
     *
     * @return boolean
     */
    this.getState = function(){
        return this._state;
    };

    /**
     * Gets the inputs assigned to this object
     *
     * @return array
     */
    this.getInputs = function(){
        return this._inputs;
    };

    /**
     * Gets the outputs assigned to this object
     *
     * @return array
     */
    this.getOutputs = function(){
        return this._outputs;
    };

    /**
     * Adds a new input to the object. Essentially this adds subscribes
     * this object to the stateChange event of the input
     *
     * @param io input
     *
     * @return io
     */
    this.addInput = function( input ){
        if ( !(input instanceof io) )
        {
            throw 'Input must be of type \'io\'';
        }

        //Ensure that the input has not already been added. We don't want to
        //attempt to add it again, that's just damned inefficient
        if ( $.inArray(input, this._inputs) == -1 )
        {
            this._inputs.push(input);
            input.addOutput(this);
        }

        return this;
    };

    /**
     * Adds an output to this object. Effectively this subscribes 'output'
     * to the stateChange event of this object
     *
     * @param io output
     *
     * @return io
     */
    this.addOutput = function( output ){
        if ( !(output instanceof io) )
        {
            throw 'Output must be of type \'io\'';
        }

        //Ensure that the output has not already been added. We don't want to
        //attempt to add it again, that would be silly
        if ( $.inArray(output, this._outputs) == -1 )
        {
            this._outputs.push(output);
            output.addInput(this);
            _stateChange(this);
        }

        return this;
    };
}

//Some IOs need to be drawn. To deal with this, extend the sprite
gamejs.utils.objects.extend(io, gamejs.sprite.Sprite);
