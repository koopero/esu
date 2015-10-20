const esu = require('../index')
    , System = esu.System
    , assert = require('chai').assert


describe('System', function () {

  function FishTank() {
    return esu.Universe([
      { species: 'guppy' },
      { species: 'sucka' },
      { species: 'tetra' },
      { species: 'snail' },
      { species: 'prawn' }
    ])
  }

  describe('new', function () {
    it('from object', function () {
      var system = System( {
        test: testFunc
      })

      assert.instanceOf( system, System )
      assert.isFunction( system.test )
      system.test()

      function testFunc() {
        assert.equal( this, system )
      }
    })
  })

  describe('.map', function () {

    it('will work', function () {
      var tank = FishTank()
      var system = tank.system( 'species' )

      assert.equal( system.universe, tank )

      var result = system.map( function ( entity, species ) {
        assert.equal( entity.species, species )
        assert.equal( this, system )
      } )
    })

  })
})
