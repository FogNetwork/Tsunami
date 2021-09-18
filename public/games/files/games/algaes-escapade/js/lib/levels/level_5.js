[
    {"type":"stats","clonePar":1,"timePar":20,"lastLevel":true},
    {"type":"wall","x":0,"y":680,"repeat-x":2},
    {"type":"player","x":50,"y": 550},
    {"type":"platform", "x": 150, "y": 520,"width":250,"height":26},
    {"type":"orGate","x":0,"y":0,"outputs":[
        {"type":"door", "x":150,"y":68},
        {"type":"door", "x":315,"y":68}
    ],"inputs":[
        {"type":"lever","x":450,"y": 641},
        {"type":"lever","x":800,"y": 641,"outputs":[
            {"type":"door", "x":900,"y":218},
            {"type":"orGate","x":0,"y":0,"outputs":[
                {"type":"door", "x":600,"y":218}
            ],"inputs":[
                {"type":"lever","x":235,"y": 492}
            ]}
        ]}
    ]},
    {"type":"goal","x":1090,"y":540}
]