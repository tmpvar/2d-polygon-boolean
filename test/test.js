var test = require('tape');
var pbool = require('../2d-polygon-boolean');

var subject = [
  [0, 0],
  [100, 0],
  [100, 100],
  [0, 100],
  [0, 0]
];

var clip = [
  [90, 90],
  [110, 90],
  [110, 110],
  [90, 110],
  [90, 90]
];

var clip2 = [
  [85, 95],
  [95, 95],
  [95, 105],
  [85, 105]
];

test('diff polys and return the remainder of the subject', function(t) {
  var difference = pbool(subject, clip, 'not')[0];
  t.deepEqual(difference[0], [100, 90]);
  t.deepEqual(difference[1], [100, 0]);
  t.deepEqual(difference[2], [0, 0]);
  t.deepEqual(difference[3], [0, 100]);
  t.deepEqual(difference[4], [90, 100]);
  t.deepEqual(difference[5], [90, 90]);
  t.end();
});

test('return the intersection of `subject` and `clip`', function(t) {
  var intersection = pbool(subject, clip, 'and')[0];
  t.deepEqual(intersection[0], [100, 90]);
  t.deepEqual(intersection[1], [100, 100]);
  t.deepEqual(intersection[2], [90, 100]);
  t.deepEqual(intersection[3], [90, 90]);
  t.end();
});

test('return the intersection of `subject` and `clip2`', function(t) {
  var intersection = pbool(subject, clip2, 'and')[0];

  t.deepEqual(intersection[0], [95, 100]);
  t.deepEqual(intersection[1], [85, 100]);
  t.deepEqual(intersection[2], [85, 95]);
  t.deepEqual(intersection[3], [95, 95]);
  t.end();
});

test('return the intersection of `clip` and `clip2`', function(t) {
  var union3 = pbool(clip, clip2, 'and')[0];
  t.deepEqual(union3[0], [90, 105]);
  t.deepEqual(union3[1], [90, 95]);
  t.deepEqual(union3[2], [95, 95]);
  t.deepEqual(union3[3], [95, 105]);
  t.end();
});

test('reuse polygons', function(t) {
  var intersection = pbool(subject, clip, 'and')[0];
  var intersection2 = pbool(intersection, clip2, 'and')[0];
  t.deepEqual(intersection2[0], [95, 100]);
  t.deepEqual(intersection2[1], [90, 100]);
  t.deepEqual(intersection2[2], [90, 95]);
  t.deepEqual(intersection2[3], [95, 95]);
  t.end();
});

test('union polygons', function(t) {
  var union = pbool(subject, clip, 'or')[0];

  t.deepEqual(union, [
    [100, 90],
    [100, 0],
    [0, 0],
    [0, 100],
    [90, 100],
    [90, 110],
    [110, 110],
    [110, 90]
  ]);

  t.end();
});

test('return multiple polygons (intersect)', function(t) {
  var a = [
    [ 0,  0],
    [60,  0],
    [60, 30],
    [40, 30],
    [40, 10],
    [20, 10],
    [20, 30],
    [0, 30]
  ];

  var b = [
    [-10, 15],
    [70, 15],
    [70, 25],
    [-20, 25]
  ];

  var i = pbool(a, b, 'and');

  t.equal(i.length, 2);

  t.deepEqual(i[0], [
    [60, 15],
    [60, 25],
    [40, 25],
    [40, 15]
  ]);

  t.deepEqual(i[1], [
    [20, 15],
    [20, 25],
    [0, 25],
    [0, 15]
  ]);

  t.end();
});
