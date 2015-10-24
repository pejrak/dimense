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