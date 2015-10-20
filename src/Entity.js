module.exports = Entity

const assert = require('assert')

function Entity() {

}

Entity.prototype.set = function ( key, value ) {
  this[key] = value
}

Entity.prototype.component = function ( system, value ) {
  const entity = this
      , universe = entity.universe

  system = universe.system( system )

  assert( system, 'System not defined' )

  const key = system.key
}
