# polygon.clip

Implementation of the Greiner-Kai "efficient clipping of arbitrary polygons" [paper](http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf)

## install

`npm install 2d-polygon-boolean`

## use

### signature

`var polygons = polygonBoolean(array1, array2, mode)`

Where mode is the string `and` (intersect), `or` (union), `not` (cut)

`polygons` is an array of arrays of arrays

e.g
```javascript
  [
    [
      [0, 0],
      [0, 1],
      [1, 1]
    ]
  ]
```
### example

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

# license

[MIT](LICENSE.txt)
