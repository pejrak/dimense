// dimense.js

"use strict";

var App = (function() {

  var _scene, _camera, _renderer, _geometry, _plane,
      _cube, _material, _object, _light, _ambient

  function setupScene() {
    _scene       = new THREE.Scene()
    _camera      = 
        new THREE.PerspectiveCamera( 
          75, window.innerWidth / window.innerHeight, 0.1, 1000 
        )
    _renderer    = 
        new THREE.WebGLRenderer({ antialias : true })
    _renderer.setSize(window.innerWidth, window.innerHeight)
    _renderer.shadowMapEnabled = true
    _renderer.shadowMapSoft = true;

    adjustCamera()
    addLight()

    $("body").append(_renderer.domElement)
  }

  function adjustCamera() {
    _camera.position.z = 10
    _camera.position.y = -5
    _camera.lookAt({
      x: 0,
      y: 0,
      z: 0
    })
    // _camera.position.x = 20
  }

  function addLight() {
    _light = new THREE.SpotLight(0xdfebff, 1, 50)
    _light.target.position.set( 0, 0, 0 )
    _light.position.set(1, 1, 7)
    _light.castShadow = true
    _light.shadowDarkness = 0.2
    _light.shadowCameraVisible = true
    _light.shadowCameraNear  = 0.01
    _ambient = new THREE.AmbientLight(0x666666)
    _scene.add( _ambient )
    _scene.add(_light)
  }

  function addPlane() {
    var geometry = new THREE.PlaneGeometry(20, 20, 32)
    var material = new THREE.MeshLambertMaterial({ 
          color: 0x9a9a9a, side: THREE.DoubleSide 
        })
    
    _plane = new THREE.Mesh(geometry, material)
    _plane.receiveShadow = true
    _scene.add(_plane)
  }
  
  function addCube() {
    _geometry     = new THREE.BoxGeometry(2, 2, 2)
    _material     = new THREE.MeshLambertMaterial({ color: 0x00ff00 })
    _cube         = new THREE.Mesh(_geometry, _material)
    _cube.position.set(0, 0, 2)
    _cube.castShadow    = true
    _cube.receiveShadow = true
    _scene.add(_cube)
  }

  function importObject(path, done) {
    var loader = new THREE.JSONLoader()

    loader.load(path, function (mesh) {
      _object = new THREE.Mesh(mesh, new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
      _object.position.x    = 0
      _object.position.y    = 0
      _object.position.z    = 0
      _object.castShadow    = true
      _object.receiveShadow = true

      _scene.add(_object)

      console.log("imported:", _object)
      done()
    })
  }

  function render() {

    requestAnimationFrame(render)

    if (_cube) {
      _cube.rotation.x += 0.01
      _cube.rotation.y += 0.01
    }

    if (_object) {
      _object.rotation.x += 0.01
      _object.rotation.y += 0.01
    }

    _renderer.render(_scene, _camera)

  }

  function initialize() {
    setupScene()
    addPlane()
    addCube()
    render()
    // importObject("models/box0.json", render)
  }

  return {
    initialize: initialize
  }
  
} ())


$(document).ready(App.initialize)