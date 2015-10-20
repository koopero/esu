const esu = require('../index')
    , Universe = esu.Universe
    , assert = require('chai').assert

describe('Universe', function() {


  describe('new', function () {
    it('will construct', function () {
      var universe = Universe()
    })

    it('( [ entities... ] )', function () {
      var universe = Universe( [ {}, {} ] )
      assert.equal( universe.entities.length, 2 )
    })

    it('( numEntities )', function () {
      var universe = Universe( 100 )
      assert.equal( universe.entities.length, 100 )
    })

    it('( { entities: [ entities... ] } )', function () {
      var universe = Universe( { entities: [ {}, {}, {} ] } )
      assert.equal( universe.entities.length, 3 )
    })

  })

  describe('.entity', function () {
    it('will create an entity', function () {
      var universe = Universe()
      var entity = universe.entity( {
        a: 1,
        b: 2
      })

      assert.isObject( entity, 'Bad entity format' )
      assert.instanceOf( entity, esu.Entity )
      assert.equal( entity.universe, universe, 'Entity universe not set')
      assert.isDefined( entity.id, 'Entity has no id' )
      assert.equal( entity.a, 1, 'Presets not loaded' )
    })

    it('will load an entity', function () {
      var universe = Universe()
      var created = universe.entity({ a: 1 })
      var loaded = universe.entity( created.id )

      assert.isObject( loaded )
      assert.equal( loaded, created )
    })

    it('is idempotent', function () {
      var universe = Universe()
      var created = universe.entity({ a: 1 })
      var loaded = universe.entity( created )
      loaded = universe.entity( loaded )

      assert.equal( loaded, created )
    })
  })

  describe('.map', function () {
    it('!!', function () {
      var universe = Universe()
      assert.isFunction ( universe.map )
    })

    it('( func ) will map all entities', function () {
      var universe = Universe()
      universe.entity({})
      universe.entity({})

      var count = 0
      universe.map( function ( entity ) {
        assert.instanceOf( entity, esu.Entity )
        count ++
      })

      assert.equal( count, 2 )
    })

    it('( func ) will map all entities', function () {
      var universe = Universe()
      universe.entity({})
      universe.entity({})

      var count = 0
      universe.map( function ( entity ) {
        assert.instanceOf( entity, esu.Entity )
        count ++
      })

      assert.equal( count, 2 )
    })


    it('( [ key ], func ) will query by component list', function () {
      var universe = Universe( {
        entities: [
          { value: 1 },
          { value: 0 },
          { },

        ]
      })

      universe.map( function ( entity ) {
        assert.instanceOf( entity, esu.Entity )
      })

    })

    it('( [ key ], func ( entity, component ) ) will pass components as parameters', function () {
      var universe = Universe( {
        entities: [
          { colour: 'red' },
          { colour: 'blue', shade: 'dark' },
          { shade: 'transparent' }
        ]
      })

      universe.map( ['colour'], function ( entity, colour ) {
        assert( entity.colour, 'False negative' )
        assert.equal( colour, entity.colour )
      })

      universe.map( ['colour', 'shade' ], function ( entity, colour, shade ) {
        assert( entity.colour, 'False negative' )
        assert.equal( colour, entity.colour )
        assert.equal( shade, entity.shade )
      })

    })

  })

  describe('.filter', function () {
    it('will list all entities', function () {
      var universe = Universe()
      var first = universe.entity({})
      universe.entity({})

      var result = universe.filter()
      assert.isArray( result )
      assert.equal( result.length, 2 )
      assert.equal( result[0], first )
    })

    it('will filter by list of keys', function () {
      var universe = Universe()
      universe.entity({
        b: 1
      })
      var filtered = universe.entity({
        a: 1
      })

      var result = universe.filter( ['a'] )
      assert.isArray( result )
      assert.equal( result.length, 1 )
      assert.equal( result[0], filtered )
    })
  })


  describe('.system', function () {
    it('will create a system', function () {
      var universe = Universe()
      var system = universe.system('key')

      assert.instanceOf( system, esu.System )
    })

    it('is idempotent', function () {
      var universe = Universe()
      var created = universe.system('key')
      var loaded = universe.system('key')

      assert.equal( created, loaded )

    } )
  })
} )
