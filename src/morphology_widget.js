var THREE = require('./three.min.js');
require('./trackball_controls.js');
require('./lut.js');

function MorphologyWidget(container, morphology, dims) {
    this.container = container;
    this.morphology = morphology;
    this.aspect = 1.5;

    var _self = this;
    
    var _camera = null;
    var _scene = null;
    var _renderer = null;
    var _origin = null;
    var _controls = null;
    var _light = null;
    
    var _compartment_colors = {
        0: { r: 0, g: 0, b: 0 },
        1: { r:1, g:1, b:1 },    // soma, white
        2: { r:.5, g:.5, b:.5 }, // axon gray
        3: { r:0, g:1, b:0 },    // basal dendrite, green
        4: { r:1, g:0, b:1 }     // apical dendrite, magenta
    };
    
    function get_dims() {
        var w = _self.container.innerWidth()
        return { 'w': w, 'h': w / _self.aspect };
    }

    function init() {
        var dims = get_dims();

        _camera = new THREE.PerspectiveCamera( 27, dims.w / dims.h, 1, 10000 );
	_camera.position.z = 1000;

	_scene = new THREE.Scene();

        var cindex = _self.morphology.compartment_index;

        var vertices = new Float32Array(_self.morphology.count * 3);
        var colors = new Float32Array(_self.morphology.count * 3);
        var lut = new THREE.Lut("blackbody", 64);
        lut.setMax(.5);
        lut.setMin(0);

        var cid_map = {};

        var i = 0;
        for (var cid in cindex) {
            var c = cindex[cid];

            vertices[3*i] = c.x;
            vertices[3*i+1] = c.y;
            vertices[3*i+2] = c.z;
            
            var color = _compartment_colors[c.type];//lut.getColor(c.r);
            
            colors[3*i] = color.r;
            colors[3*i+1] = color.g;
            colors[3*i+2] = color.b;

            cid_map[c['id']] = i;
            i += 1;
        }

        var line_ids = new Uint16Array( _self.morphology.count * 2 - 1 );

        var i = 0;
        for (var cid in cindex) {
            var c = cindex[cid];

            if ( !(c['parent'] in cindex) ) {
                continue;
            }

            var p = cindex[c['parent']];
            
            line_ids[2*i] = cid_map[p['id']];
            line_ids[2*i+1] = cid_map[cid];;

            i += 1;
        }
        
        var vertex_attribute = new THREE.BufferAttribute(vertices, 3);
        var lines_attribute = new THREE.BufferAttribute(line_ids, 1);
        var colors_attribute = new THREE.BufferAttribute(colors, 3);

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', vertex_attribute)
        geometry.addAttribute('index', lines_attribute);
        geometry.addAttribute('color', colors_attribute);
        geometry.computeBoundingSphere();

        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, linewidth:2 });
        var mesh = new THREE.Line(geometry, material, THREE.LinePieces);
        _origin = geometry.boundingSphere.center;


        var root = _self.morphology.root;
        var m = new THREE.Matrix4().makeTranslation(-_origin.x, 
                                                    -_origin.y, 
                                                    -_origin.z);
        mesh.matrix.copy(m);
        mesh.matrixAutoUpdate = false;
        
        _scene.add(mesh);

        var geometry = new THREE.SphereGeometry( root.r, 32, 32 );
        var material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
        var sphere = new THREE.Mesh( geometry, material );
        var m = new THREE.Matrix4().makeTranslation(root.x - _origin.x,
                                                    root.y - _origin.y,
                                                    root.z - _origin.z)
        sphere.matrix.copy(m);
        sphere.matrixAutoUpdate = false;

        _scene.add( sphere );

        _light = new THREE.PointLight(0xffffff);
        _light.position.set(0,0,100);
        _scene.add(_light);

        _renderer = new THREE.WebGLRenderer( { antialias: false } );
	_renderer.setPixelRatio( window.devicePixelRatio );
	_renderer.setSize( dims.w, dims.h );

	_renderer.gammaInput = true;
	_renderer.gammaOutput = true;

        _controls = new THREE.TrackballControls( _camera, _self.container[0] );
        _controls.addEventListener( 'change', render );
        
	_self.container[0].appendChild( _renderer.domElement );

        window.addEventListener( 'resize', onWindowResize, false );
        
        render();
        animate();
    }

    function onWindowResize() {
        var dims = get_dims();
        
	_camera.aspect = dims.w / dims.h;
	_camera.updateProjectionMatrix();
        
	_renderer.setSize( dims.w, dims.h );
        
    }
    
    //
    
    function animate() {
        
	requestAnimationFrame( animate );
        _controls.update();
    }

    
    function render() {
        _light.position.copy(_camera.position);
	_renderer.render( _scene, _camera );
    }
    
    init();
}

module.exports.MorphologyWidget = MorphologyWidget;
