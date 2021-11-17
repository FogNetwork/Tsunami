[
    {"type":"stats","clonePar":1,"timePar":15},
    {"type":"wall","x":0,"y":680,"repeat-x":2},
    {"type":"player","x":150,"y": 550},
    {"type":"lever","x":350,"y": 641,"outputs":[
        {"type":"door", "x":500,"y":218},
        {"type":"notGate", "outputs":[
            {"type":"door", "x":700,"y":218}
        ]}
    ]},
    {
        "type":"tooltip","x":300,"y":641,"width":100,"height":100,
        "text":"Press <span class='button e'>e</span> or <span class='button enter'>enter</span> to activate switches<br>Some switches will only activate a door when they are off"},
    {
        "type":"tooltip","x":550,"y":641,"width":50,"height":50,
        "text":"Press <span class='button c'>c</span> to create a clone<br/>Press <span class='button tab'>tab</span> to switch between them"},
    {"type":"goal","x":890,"y":540}
]