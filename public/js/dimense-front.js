// dimense.js
/*
  @author pejrak: 
*/

"use strict";

var App = (function() {

  var _scene, _camera, _renderer, _geometry, _plane, _material, _object, _controls,
      _light, _ambient, _pointer, _raycaster, _previous_x, _camera_vector, _effect,
      // GUI elements
      _GUI, _pause_indicator

  var _clickables         = []
  var _objects            = []
  var _timer              = {}
  var _view_rotation      = {}
  var _default_background = 0xF8FCFC
  var _pause_background   = 0xeeeeee
  var MAX_ROTATION        = 0.1
  var PI2                 = Math.PI * 2
  var CUTOFF              = 0.05
  var FOV                 = 100
  var PAUSE               = false
  var VR                  = true
  var DUMMY_DATA          = { 
    fields: [
      { name: "Header title 0", key: "field_0" },
      { name: "Header title 1", key: "field_1" },
      { name: "Header title 2", key: "field_2" },
      { name: "Header title 3", key: "field_3" },
      { name: "Header title 4", key: "field_4" }
    ],
    data: [
      { 
        field_0: "field 0 value 0", 
        field_1: "field 1 value 0", 
        field_2: "field 2 value 0", 
        field_3: "field 3 value 0",
        field_4: "field 4 value 0",
      },
      { 
        field_0: "field 0 value 1", 
        field_1: "field 1 value 1", 
        field_2: "field 2 value 1", 
        field_3: "field 3 value 1",
        field_4: "field 4 value 1", 
      },
      { 
        field_0: "field 0 value 2", 
        field_1: "field 1 value 2", 
        field_2: "field 2 value 2", 
        field_3: "field 3 value 2", 
        field_4: "field 4 value 2" 
      },
      { 
        field_0: "field 0 value 3", 
        field_1: "field 1 value 3", 
        field_2: "field 2 value 3", 
        field_3: "field 3 value 3", 
        field_4: "field 4 value 3" 
      }
    ]
  }



  function setupScene() {
    _scene                      = new THREE.Scene()
    _camera                     = 
      new THREE.PerspectiveCamera( 
        FOV, window.innerWidth / window.innerHeight, 0.1, 1000 
      )
    _camera_vector              = new THREE.Vector3(0, 0, -1)
    _renderer                   = 
      new THREE.WebGLRenderer({ antialias : true })
    
    _renderer.shadowMapEnabled  = true
    _renderer.shadowMapSoft     = true
    _raycaster                  = new THREE.Raycaster()
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

    if (VR === true) {
      _controls   = new THREE.VRControls(_camera)
      _effect     = new THREE.VREffect(_renderer)
      _effect.setSize(window.innerWidth, window.innerHeight)
    }
    else {
      _renderer.setSize(window.innerWidth, window.innerHeight)
    }
    _renderer.setClearColor(0xF8FCFC, 1)
    adjustCamera()
    addLight()

    $("#contents").html(_renderer.domElement)
  }

  function addListeners() {
    var content = document.getElementById("contents")

    $("#contents").on("click", clickTrigger)
    $("#contents").on("mousemove", setPointerCoordinates)
    // $(window).scroll(zoom)
    $("body").on("keyup", trackKeys)

    content.addEventListener("mousewheel", zoom, false)
    content.addEventListener("DOMMouseScroll", zoom, false)
  }

  function trackKeys(event) {
    var key             = event.which
    var space_pressed   = (key === 32)
    var z_pressed       = (key === 90)

    console.log("trackKeys | key, space_pressed:", key, space_pressed)
    if (space_pressed) {
      PAUSE = !PAUSE
      _renderer.setClearColor(
        PAUSE ? _pause_background : _default_background, 1
      )
    }
    else if (z_pressed) { // z
      _controls.zeroSensor();
    }
  }

  function zoom(event) {
    var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))

    console.log("zoom | delta, event, _camera_vector:", delta, event, _camera_vector)

    _camera.translateZ( - 10 * delta )

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
    _camera_vector    = 
      (new THREE.Vector3(0, 0, -1)).applyQuaternion(_camera.quaternion)
  }

  function adjustCamera() {
    // _camera.position.z = 100
    // _camera.position.y = -5
    // _camera.lookAt({
    //   x: 0,
    //   y: 0,
    //   z: 0
    // })
  
    _camera.position.z = .1
    _camera.lookAt( new THREE.Vector3( 0 , 0 , -1 ) )
  }

  function addCenter() {
    var geometry  = new THREE.CubeGeometry(1, 1, 1)
    var material  = new THREE.MeshBasicMaterial({ color: "red" })
    var mesh      = new THREE.Mesh(geometry, material)

    _scene.add(mesh)
  }

  function addLight() {
    _light                      = new THREE.SpotLight(0xdfebff, 1, 200)
    _ambient                    = new THREE.AmbientLight(0x666666)

    _light.castShadow           = true
    _light.shadowDarkness       = 0.1
    _light.shadowCameraVisible  = true
    _light.shadowCameraNear     = 100

    _light.target.position.set( 0, 0, 0 )
    _light.position.set(2, 0, 100)
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

    var mat_attrs = {
      color: options.color || 0xcccccc,
    }

    if (options.content) {
      var dynText           = new THREEx.DynamicTexture(512,512)

      mat_attrs.map         = dynText.texture
      dynText.context.font  = "bold 50px Arial"
      dynText.clear("white")
        .drawText(options.content, null, 256, "black")
    }

    var geometry      = new THREE.PlaneGeometry(1, 1)
    var material      = new THREE.MeshLambertMaterial(mat_attrs)
    var point         = new THREE.Mesh(geometry, material)

    point.position.set(
      options.position.x, 
      options.position.y, 
      options.position.z
    )

    point.scale.x       = options.size.x
    point.scale.y       = options.size.y
    point.rotation.x    = options.rotation.x
    point.rotation.y    = options.rotation.y
    point.rotation.z    = options.rotation.z
    point.receiveShadow = true


    _clickables.push(point)
    _objects.push(point)
    _scene.add(point)
  }

  function construct(options) {
    var data          = options.data
    var cols          = options.fields.length
    var rows          = options.data.length
    var size          = options.size || 100
    var start         = { x: - (size / 2), y: (size / 2) }
    var point_x_size  = (size / (cols * 2))
    var point_y_size  = (point_x_size / 2)

    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {

        var field     = options.fields[x]
        var key       = (field || {}).key
        var content   = (data[y] || {})[key]
        var x_pos     = (x * point_x_size * 2) + start.x + point_x_size
        var y_pos     = start.y - ((y * point_y_size * 2) + point_y_size)

        addPoint({
          position: {
            x: x_pos, 
            y: y_pos, 
            z: 0,  
          },
          size: {
            x: point_x_size,
            y: point_y_size
          },
          rotation: {
            z: 0,
            y: - (x_pos / (size)),
            x: y_pos / (size)
          },
          content: content
        })
      }
    }
  }



  function render() {
    requestAnimationFrame(render)

    if ( VR === true ) {
      _controls.update()
      _effect.render(_scene, _camera)
    }
    else {
      if ((_pointer.trigger.x || _pointer.trigger.y) && !PAUSE) {
        _camera.rotation.y -= (_pointer.vector.x * 0.01)
        _camera.rotation.x += (_pointer.vector.y * 0.01)
      }
      _renderer.render(_scene, _camera)
    }
    _previous_x = _pointer.vector.x    
  }

  function initialize() {
    setupScene()
    addCenter()
    construct(DUMMY_DATA)
    render()
    addListeners()
  }

  return {
    initialize: initialize
  }
  
} ())


$(document).ready(App.initialize)