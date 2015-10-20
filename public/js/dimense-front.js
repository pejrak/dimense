// dimense.js

"use strict";

var App = (function() {

  var _scene, _camera, _renderer, _geometry, _plane, _particle_material,
      _material, _object, _light, _ambient, _pointer, _raycaster, _previous_x

  var _clickables     = []
  var _objects        = []
  var _timer          = {}
  var _view_rotation  = {}
  var MAX_ROTATION    = 0.1
  var PI2             = Math.PI * 2
  var CUTOFF          = 0.05
  var DUMMY_DATA      = { 
    fields: [
      { name: "Header title 0", key: "field_0" },
      { name: "Header title 1", key: "field_1" },
      { name: "Header title 2", key: "field_2" }
    ],
    data: [
      { 
        field_0: "field 0 value 0", 
        field_1: "field 1 value 0", 
        field_2: "field 2 value 0" 
      },
      { 
        field_0: "field 0 value 1", 
        field_1: "field 1 value 1", 
        field_2: "field 2 value 1" 
      }
    ]
  }



  function setupScene() {
    _scene                      = new THREE.Scene()
    _camera                     = 
      new THREE.PerspectiveCamera( 
        75, window.innerWidth / window.innerHeight, 0.1, 1000 
      )
    _renderer                   = 
      new THREE.WebGLRenderer({ antialias : true, alpha: true })
    
    _renderer.shadowMapEnabled  = true
    _renderer.shadowMapSoft     = true
    _raycaster                  = new THREE.Raycaster()
    _particle_material          = new THREE.SpriteMaterial({
      color: 0x000000,
      program: function ( context ) {
        context.beginPath()
        context.arc( 0, 0, 0.5, 0, PI2, true )
        context.fill()
      }
    })
    _pointer                    = {
      client: {
        x: 0,
        y: 0
      },
      vector: new THREE.Vector2(),
      trigger: {
        x: false,
        y: false
      }
    }

    _renderer.setSize(window.innerWidth, window.innerHeight)
    _renderer.setClearColor(0xF8FCFC, 1)
    adjustCamera()
    addLight()

    $("#contents").html(_renderer.domElement)
  }

  function addListeners() {
    $("#contents").on("click", clickTrigger)
    $("#contents").on("mousemove", setPointerCoordinates)
  }

  function timeIt(fn, delay) {
    var fn_name = fn.name || "default"

    if (_timer[fn_name]) {
      clearTimeout(_timer[fn_name])
    }
    delay = delay || 300
    _timer[fn_name] = setTimeout(fn, delay)
  }

  function clickTrigger(event) {
    event.preventDefault()
    setPointerCoordinates(event)
    _raycaster.setFromCamera(_pointer.vector, _camera)

    var intersects = _raycaster.intersectObjects(_clickables)

    if (intersects.length > 0) {
      intersects[0].object.material.color.setHex(Math.random() * 0xffffff)
    }
  }

  function setPointerCoordinates(event) {
    _pointer.client.x = event.clientX
    _pointer.client.y = event.clientY
    _pointer.vector.x = 
      (_pointer.client.x / _renderer.domElement.width) * 2 - 1
    _pointer.vector.y = 
      - (_pointer.client.y / _renderer.domElement.height) * 2 + 1
    _pointer.trigger  = {
      x: (Math.abs(_pointer.vector.x) - 0.5) > 0,
      y: (Math.abs(_pointer.vector.y) - 0.5) > 0
    }  

    //console.log("setPointerCoordinates | _pointer:", _pointer)
  }

  function adjustCamera() {
    _camera.position.z = 10
    _camera.position.y = -5
    _camera.lookAt({
      x: 0,
      y: 0,
      z: 0
    })
  }

  function addLight() {
    _light                      = new THREE.SpotLight(0xdfebff, 1, 50)
    _ambient                    = new THREE.AmbientLight(0x666666)

    _light.castShadow           = true
    _light.shadowDarkness       = 0.2
    _light.shadowCameraVisible  = true
    _light.shadowCameraNear     = 0.01

    _light.target.position.set( 0, 0, 0 )
    _light.position.set(1, 1, 20)
    _scene.add( _ambient )
    _scene.add(_light)
  }

  function addPlane() {

    var geometry          = new THREE.PlaneGeometry(20, 20, 32)
    var material          = 
      new THREE.MeshLambertMaterial({ 
        color: 0x9a9a9a, side: THREE.DoubleSide 
      })
    
    _plane                = new THREE.Mesh(geometry, material)
    _plane.receiveShadow  = true
    _scene.add(_plane)
  }
  
  function addPoint(options) {

    var mat_attrs     = {
      color: options.color || 0xff0000,
    }

    if (options.content) {
      var dynText     = new THREEx.DynamicTexture(512,512)
      mat_attrs.map   = dynText.texture

      dynText.context.font = "bold 50px Arial"

      console.log("options.content:", options.content)
      dynText.clear("red")
        .drawText(options.content, null, 256, "black")
    }

    var geometry      = new THREE.PlaneGeometry(1, 1, 10)
    var material      = new THREE.MeshLambertMaterial(mat_attrs)
    var point         = new THREE.Mesh(geometry, material)

    point.position.set(
      options.position.x || 0, 
      options.position.y || 0, 
      options.position.z || 2
    )
    // point.castShadow    = true
    // point.receiveShadow = true

    _clickables.push(point)
    _objects.push(point)
    _scene.add(point)
  }

  function construct(options) {
    var data = options.data
    var cols = options.fields.length
    var rows = options.data.length

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var field         = options.fields[x]
        var key           = (field || {}).key
        var content       = (data[y] || {})[key]

        console.log("construct | key, content:", key, content)

        addPoint({
          position: {
            x: (x * 2) - (rows), 
            y: (y * 2 - cols), 
            z: 2,  
          },
          size: {
            x: 2,
            y: 2
          },
          content: content
        })
      }
    }
  }

  function importObject(path, done) {
    var loader = new THREE.JSONLoader()

    loader.load(path, function (mesh) {
      var geometry          = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      _object               = new THREE.Mesh(mesh, geometry)
      _object.position.x    = 0
      _object.position.y    = 0
      _object.position.z    = 0
      _object.castShadow    = true
      _object.receiveShadow = true
      _scene.add(_object)

      return done()
    })
  }

  function render() {
    requestAnimationFrame(render)
    if (_pointer.trigger.x || _pointer.trigger.y) {
      _camera.rotation.y -= (_pointer.vector.x * 0.01)
      _camera.rotation.x += (_pointer.vector.y * 0.01)
    }
    _renderer.render(_scene, _camera)
    _previous_x = _pointer.vector.x
  }

  function initialize() {
    setupScene()
    // addPlane()
    construct(DUMMY_DATA)
    render()
    addListeners()
  }

  return {
    initialize: initialize
  }
  
} ())


$(document).ready(App.initialize)