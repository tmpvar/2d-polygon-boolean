# polygon.clip

Implementation of the Greiner-Kai "efficient clipping of arbitrary polygons" [paper](http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf)

## install

`npm install poygon.clip`

## use

### signature

`Polygon#clip(clippingPolygon, mode)`

Where mode is `'difference'` or `'union'`

### example

Lets clip two squares

```javascript

var Polygon = require('polygon.clip'),
    Vec2 = require('vec2');

var subject = Polygon([
  Vec2(0, 0),
  Vec2(100, 0),
  Vec2(100, 100),
  Vec2(0, 100),
  Vec2(0, 0)
]);

var clip = Polygon([
  Vec2(90, 90),
  Vec2(110, 90),
  Vec2(110, 110),
  Vec2(90, 110),
  Vec2(90, 90)
]);


// union is an array of Polygons
var union = subject.clip(clip, 'union');

console.log(JSON.stringify(union[0].points, null, '  '));
```

In this case, there will only be one polygon in the `union` array, and it will define the upper corner of the subject polygon

`[[100, 90], [100,100], [90, 100], [90,90]]`

# license

MIT
