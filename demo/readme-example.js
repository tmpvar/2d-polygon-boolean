var Polygon = require('../clip.js'),
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
