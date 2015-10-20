
## Entity

## System

## Universe

## Component

In **ESU**, components are given less importance than in ECS architectures. They are simply data values stored on Entities.



# Example

```javascript
var esu = require('esu')
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
```


# Status

This module is under construction.
