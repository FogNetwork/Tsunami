[
    {"type":"stats","clonePar":2,"timePar":10},
    {"type":"wall","x":0,"y":680,"repeat-x":2},
    {"type":"player","x":150,"y": 550},
    {"type":"andGate","inputs":[
        {"type":"lever","x":250,"y": 641},
        {"type":"lever","x":450,"y": 641}
    ], "outputs": [
        {"type":"door", "x":700,"y":218}
    ]},
    {
        "type":"tooltip","x":250,"y":641,"width":100,"height":100,
        "text":"Some doors can only be opened when two or more<br/>switches are held down at the same time"},
    {
        "type":"tooltip","x":650,"y":641,"width":50,"height":50,
        "text":"Press <span class='button c'>c</span> to create a clone<br/>Press <span class='button tab'>tab</span> to switch between them"},
    {"type":"goal","x":890,"y":540}
]