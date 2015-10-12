module.exports = ( function() {

  // Custom time labelling
  function timeLabel() {

    var t   = new Date()
    var h   = ("0" + t.getHours()).slice(-2)
    var m   = ("0" + t.getMinutes()).slice(-2)
    var s   = ("0" + t.getSeconds()).slice(-2)
    var y   = t.getFullYear()
    var mn  = ("0" + (t.getMonth() + 1)).slice(-2)
    var d   = ("0" + t.getDate()).slice(-2)
    var l   = ""+y+""+mn+""+d+""+h+""+m+""+s

    return (l)
  }

  // Custom logging
  function LOG (module_name) {
    return (function() {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(module_name.toUpperCase() + "(" + process.pid + "):")
      args.push('@' + timeLabel())
      console.log.apply(null, args)
    })
  }

  return {
    LOG: LOG,
    timeLabel: timeLabel
  }

} ())