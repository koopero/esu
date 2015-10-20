module.exports = System

const _ = require('lodash')

function System( opt ) {
  if ( opt instanceof System )
    return opt

  var system = Object.create( System.prototype )
  system.extend( opt )

  return system
}

System.prototype.extend = function ( a ) {
  _.extend( this, a )
}

System.prototype.component = function ( entity, value ) {
  const system = this
      , key = system.key
      , universe = system.universe

  entity = universe.entity( entity )

  if ( value !== undefined )
    entity.set( key, value )

  return entity[ key ]
}


System.prototype.map = function ( iteree ) {
  const system = this
      , universe = system.universe

  return universe.map( system.key, iteree, system )
}
