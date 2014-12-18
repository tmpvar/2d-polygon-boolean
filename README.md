# polygon.clip

Implementation of the Greiner-Kai "efficient clipping of arbitrary polygons" [paper](http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf)

## install

`npm install polygon.clip`

## use

### signature

`Polygon#clip(clippingPolygon, mode)`

Where mode is `'difference'` or `'union'`

### example

Lets clip two squares

```javascript

var polygonBoolean = require('2d-polygon-boolean');

var subject = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100]
];

var clip = [
  [90, 90],
  [110, 90],
  [110, 110],
  [90, 110],
  [90, 90]
];


var union = polygonBoolean(subject, clip, 'or');
console.log('union results', union);

/*
union results [ [ [ 100, 90 ],
    [ 100, 0 ],
    [ 0, 0 ],
    [ 0, 100 ],
    [ 90, 100 ],
    [ 90, 110 ],
    [ 110, 110 ],
    [ 110, 90 ] ] ]
*/

var cut = polygonBoolean(subject, clip, 'not');
console.log('cut results', cut);

/*
cut results [ [ [ 100, 90 ],
    [ 100, 0 ],
    [ 0, 0 ],
    [ 0, 100 ],
    [ 90, 100 ],
    [ 90, 90 ] ] ]
*/

var intersect = polygonBoolean(subject, clip, 'and');
console.log('intersect results', intersect);

/*
intersect results [ [ [ 100, 90 ], [ 100, 100 ], [ 90, 100 ], [ 90, 90 ] ] ]
*/
```

In this case, there will only be one polygon in the `union` array, and it will define the upper corner of the subject polygon

`[[100, 90], [100,100], [90, 100], [90,90]]`

# license

MIT
