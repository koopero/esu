const esu = require('../index')

describe('README', function () {


  it('main example', function () {


    // var esu = require('esu')
    var universe = new esu.Universe

    var counter = universe.system( 'counter', {
      'addEntity': function ( entity, data ) {
        this.component( entity, parseInt( data ) || 0 )
      },

      'increment': function () {
        this.map( function ( entity ) {
          var value = this.component( entity )
          value = value + 1
          this.component( entity, value )
        })
      }
    } )

    var entity = universe.entity( { counter: 1 } )

    counter.increment()



  })
})
