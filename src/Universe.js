module.exports = Universe

const _ = require('lodash')
    , Entity = require('./Entity')
    , System = require('./System')

function Universe( opt ) {
  const universe = Object.create( Universe.prototype )

  universe.systems = {}
  universe.entities = []

  if ( _.isNumber( opt ) || _.isArray( opt ) ) {
    opt = { entities: opt }
  }

  if ( opt ) {
    if ( opt.entities ) {
      if ( _.isArray( opt.entities ) ) {
        _.map( opt.entities, function ( entity ) {
          universe.entity( entity )
        } )
      }

      if ( _.isNumber( opt.entities ) ) {
        _.times( opt.entities, function () {
          universe.entity( {} )
        })
      }
    }
  }

  return universe
}

Universe.prototype.system = function ( key, systemCtor ) {
  const universe = this
      , system = systemCtor( key, universe )

  universe.systems[key] = system

  return system
}

Universe.prototype.entity = function ( conf ) {
  const universe = this

  if ( _.isObject( conf ) ) {

    if ( conf instanceof Entity && conf.universe == universe  )
      return conf

    return create( conf )
  } else if ( _.isNumber( conf ) || _.isString( conf ) ) {
    return load( conf )
  } else {
    throw new Error('Bad argument')
  }


  function load( id ) {
    id = parseInt( id )
    return universe.entities[id]
  }

  function create( init ) {
    const entity = new Entity()
        , id = universe.entities.length

    _.extend( entity, init )

    Object.defineProperty( entity, 'universe', { value: universe } )
    Object.defineProperty( entity, 'id', { value: id, enumerable: true } )

    // universe.mapSystems( function ( system, key ) {
    // var componentValue = entityConf[ key ]
    //   if ( !_.isUndefined( componentValue ) ) {
    //     entity.addComponent( key, componentValue )
    //   }
    // })
    universe.entities[id] = entity

    return entity
  }
}

Universe.prototype.map = function ( query, iteree, thisArg ) {
  // ( func )
  if ( arguments.length == 1 && typeof query == 'function' ) {
    iteree = query
    query = null
  }

  const universe = this
      , entities = universe.entities
      , filter = makeFilter( query )
      , argumenter = makeArgumenter( query )
      , result = []

  for ( var i = 0, k = entities.length ; i < k; i ++ ) {
    var entity = entities[i]
    if ( filter && !filter( entity, i ) )
      continue

    var args = [ entity ]

    if ( argumenter )
      argumenter( entity, args )

    var returned = iteree.apply( thisArg, args )

    if ( returned !== undefined )
      result.push( returned )
  }

  return result
}

function makeFilter( query ) {

  if ( _.isFunction( query ) ) {
    return query
  }

  if ( _.isString( query ) ) {
    query = [ query ]
  }

  if ( _.isArray( query ) ) {
    var keys = query
    return filterByKeys
  }

  function filterByKeys( entity ) {
    for ( var i = 0; i < keys.length; i++ )
      if ( entity[keys[i]] === undefined )
        return false

    return true
  }
}

function makeArgumenter( query ) {
  if ( _.isString( query ) ) {
    query = [ query ]
  }

  if ( _.isArray( query ) ) {
    var keys = query
    return argsFromKeyList
  }

  function argsFromKeyList( entity, args ) {
    for ( var i = 0; i < keys.length; i++ )
      args.push( entity[keys[i]] )
  }
}



Universe.prototype.filter = function ( query ) {
  const universe = this
      , entities = universe.entities
      , filter = makeFilter( query )

  if ( filter ) {
    return entities.filter( filter )
  } else {
    return entities.slice()
  }
}

Universe.prototype.system = function ( key, value ) {
  const universe = this
      , systems = universe.systems

  if ( !_.isString( key ) )
    throw new ArgumentError( 'system key must be string' )

  if ( !systems[key] ) {
    var newSystem = systems[key] = System( value )
    Object.defineProperty( newSystem, 'universe', { value: universe } )
    Object.defineProperty( newSystem, 'key', { value: key, enumerable: true } )
  } else if ( value !== undefined ) {
    systems[key]._extend( value )
  }

  return systems[key]

}
