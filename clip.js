var Polygon = require('polygon');
var Vec2 = require('vec2');
var segseg = require('segseg');

function Node(vec, alpha, intersection) {
  this.vec = vec.clone();
  this.alpha = alpha || 0;
  this.intersect = !!intersection;
}

Node.prototype = {
  vec: null,
  next: null,
  next: null,
  prev: null,
  nextPoly: null,
  neighbor: null,
  intersect: null,
  entry: null,
  visited : false,
  alpha : 0,

  nextNonIntersection : function() {
    var a = this;
    while(a && a.intersect) {
      a = a.next;
    }
    return a;
  },

  last : function() {
    var a = this;
    while (a.next && a.next !== this) {
      a = a.next;
    }
    return a;
  },

  createLoop : function() {
    var last = this.last();
    last.prev.next = this;
    this.prev = last.prev;
  },

  firstNodeOfInterest : function() {
    var a = this;

    if (a) {
      do {
        a=a.next;
      } while(a!==this && (!a.intersect || a.intersect && a.visited));
    }

    return a;
  },

  insertBetween : function(first, last) {
    var a = first;
    while(a !== last && a.alpha < this.alpha) {
      a = a.next;
    }

    this.next = a;
    this.prev = a.prev;
    if (this.prev) {
      this.prev.next = this;
    }

    this.next.prev = this;
  }

};

// Implementation of the Greiner-Hormann polygon clipping algorithm
//

var segseg_alpha = function(a, b, c, d) {
  var i = segseg(a.vec, b.vec, c.vec, d.vec)

  if (!i || i===true) {
    return;
  } else {
    var vec = Vec2.fromArray(i);

    return {
      intersection: vec,
      alpha_q : a.vec.distance(vec) / a.vec.distance(b.vec),
      alpha_p : c.vec.distance(vec) / c.vec.distance(d.vec)
    }
  }
};

Polygon.prototype.createLinkedList = function() {
  var ret, where;

  this.each(function(p, current) {
    if (!ret) {
      where = ret = new Node(current);
    } else {
      where.next = new Node(current);
      where.next.prev = where;
      where = where.next;
    }
  });

  return ret;
};

Polygon.prototype.clip = function(clipPoly, type) {
  var subjectList = this.createLinkedList(),
      clipList = clipPoly.createLinkedList(),
      subject, clip;

  type = type || 'difference';

  // Phase 1: Identify and store intersections between the subject
  //          and clip polygons
  var auxs = subjectList.last();
  auxs.next = new Node(subjectList.vec, auxs);
  auxs.next.prev = auxs;

  var auxc = clipList.last();
  auxc.next = new Node(clipList.vec, auxc);
  auxc.next.prev = auxc;

  for(subject = subjectList; subject.next; subject = subject.next) {
    if(!subject.intersect) {
      for(clip = clipList; clip.next; clip = clip.next) {
        if(!clip.intersect) {

          var i = segseg_alpha(subject, subject.next.nextNonIntersection(), clip, clip.next.nextNonIntersection());

          if(i) {

            var intersectionSubject = new Node(i.intersection, i.alpha_p, true);
            var intersectionClip = new Node(i.intersection, i.alpha_q, true);
            intersectionSubject.neighbor = intersectionClip;
            intersectionClip.neighbor = intersectionSubject;
            intersectionSubject.insertBetween(subject, subject.next.nextNonIntersection());
            intersectionClip.insertBetween(clip, clip.next.nextNonIntersection());
          }
        }
      }
    }
  }

  // Phase 2: walk the resulting linked list and mark each intersection
  //          as entering or exiting
  var se = this.containsPoint(subjectList.vec);
  if (type === 'difference') {
    se = !se;
  }

  for(subject = subjectList; subject.next; subject = subject.next) {
    if(subject.intersect) {
      subject.entry = se;
      se = !se;
    }
  }

  var ce = clipPoly.containsPoint(clipList.vec);
  for(clip = clipList; clip.next; clip = clip.next) {
    if(clip.intersect) {
      clip.entry = ce;
      ce = !ce;
    }
  }

  // Phase 3: collect resulting polygons
  subjectList.createLoop();
  clipList.createLoop();

  var crt, root = null, old = null;
  var results = [];
  while ((crt = subjectList.firstNodeOfInterest()) !== subjectList) {
    var result = []
    for (; !crt.visited; crt = crt.neighbor) {

      result.push(crt.vec.clone());
      var forward = !crt.entry
      while(true) {
        var newNode = new Node(crt.vec);
        newNode.next = old;
        old = newNode;
        crt.visited = true;
        crt = forward ? crt.next : crt.prev;

        if(crt.intersect) {
          crt.visited = true;
          break;
        } else {
          result.push(crt.vec);
        }
      }
    }

    var poly = Polygon(result).dedupe();
    poly.subjectList = subjectList;
    poly.clipList = clipList;
    results.push(poly)
    break;
  }

  return results;
};

module.exports = Polygon;