function Morphology(compartment_index) {
    this.compartment_index = compartment_index;
    this.root = null;
    this.count = 0;
    
    var _self = this;

    function init() {
        _self.count = 0;

        for (var cid in _self.compartment_index) {
            var c = _self.compartment_index[cid];

            if (c['parent'] == "-1")
                _self.root = c;

            _self.count += 1;
        };
        
    };

    init();
};

function parse_swc(str) {
    var lines = str.split("\n");
 
    var line;
    var node_index = {};
    for (var i = 0; i < lines.length; i++) {
        line = lines[i];

        if (line[0] == '#' || line == '')
            continue
        
        toks = line.split(' ');
        node_index[toks[0]] = {
            id: toks[0],
            type: toks[1],
            x: parseFloat(toks[2]),
            y: parseFloat(toks[3]),
            z: parseFloat(toks[4]),
            r: parseFloat(toks[5]),
            parent: toks[6]
        };
    }

    return node_index;
};

module.exports.Morphology = Morphology;
module.exports.parse_swc = parse_swc;
