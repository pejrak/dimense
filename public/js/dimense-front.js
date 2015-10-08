// dimense.js

var App = (function() {

  var _scene, _camera, _renderer, _geometry, _cube, _material, _object

  function setupScene() {
    _scene       = new THREE.Scene()
    _camera      = 
        new THREE.PerspectiveCamera( 
          75, window.innerWidth / window.innerHeight, 0.1, 1000 
        )
    _renderer    = 
        new THREE.WebGLRenderer()
    
    _renderer.setSize(window.innerWidth, window.innerHeight)
    $("body").append(_renderer.domElement) 
  }
  
  function addCube() {
    _geometry     = new THREE.BoxGeometry(2, 2, 2)
    _material     = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    _cube         = new THREE.Mesh(_geometry, _material)
    
    _scene.add(_cube)
    _camera.position.z = 5
  }

  function importObject(path, done) {
    var loader = new THREE.JSONLoader()

    loader.load(path, function (geometry) {
      _object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial())
      _object.position.x = 500
      _object.position.y = 100
      _object.position.z = 500
      _scene.add(mesh)
    })
  }

  function render() {
    requestAnimationFrame(render)

    if (_cube) {
      _cube.rotation.x += 0.1
      _cube.rotation.y += 0.1
    }

    _renderer.render(_scene, _camera)
  }
  
  setupScene()
  addCube()
  importObject("models/box0.json", render)

} ())
