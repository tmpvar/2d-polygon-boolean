var polygonBoolean = require('../2d-polygon-boolean');

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

var cut = polygonBoolean(subject, clip, 'not');
console.log('cut results', cut);

var intersect = polygonBoolean(subject, clip, 'and');
console.log('intersect results', intersect);
