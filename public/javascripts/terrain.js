"use strict";

var svg = SVG({
  name: "fractal terrain",
  author: "https://codepen.io/ge1doot/",
  size: 200,
  // millimeters
  background: "#fff",
  stroke: "#333",
  strokeWidth: 0.2,
  cpuTime: 7 // milliseconds / frame

}); /////////////////////////////////////

var size = 512;
var water = 4; // 0 for no water

var seed = Math.random() * 100000 | 0;
var hmap = [];
var line;
var pen = false; /////////////////////////////////////

console.log("seed: " + seed);

function random() {
  seed = seed * 16807 % 2147483647;
  return (seed - 1) / 2147483646;
}

function setup() {
  var randomLevel = 60;
  var nbits = size.toString(2).length - 1;

  var rnd = function rnd() {
    return randomLevel * (-1 + 2 * random());
  };

  line = new Float32Array(size + 1);

  for (var i = 0; i <= size; i++) {
    hmap[i] = new Float32Array(size + 1);
  }

  var t = 1;
  var x = size / 2;

  for (var s = 1; s <= nbits; s++) {
    for (var v = 0; v <= size; v += 2 * x) {
      for (var n = 1; n <= t; n += 2) {
        hmap[n * x][v] = (hmap[(n - 1) * x][v] + hmap[(n + 1) * x][v]) / 2 + rnd();
        hmap[v][n * x] = (hmap[v][(n - 1) * x] + hmap[v][(n + 1) * x]) / 2 + rnd();
      }
    }

    for (var _n = 1; _n <= t; _n += 2) {
      for (var m = 1; m <= t; m += 2) {
        hmap[_n * x][m * x] = 0.25 * (hmap[_n * x + x][m * x] + hmap[_n * x - x][m * x] + hmap[_n * x][m * x + x] + hmap[_n * x][m * x - x]) + rnd();
      }
    }

    t = 2 * t + 1;
    x /= 2;
    randomLevel /= 2;
  }

  for (var w = 0; w <= size; w++) {
    for (var z = 0; z <= size; z++) {
      if (hmap[w][z] < 0) hmap[w][z] = 0;
    }
  }
}

function draw(w) {
  var r = 200 / size;
  var k = 0;
  pen = false;

  for (var z = 0; z <= size; z++) {
    var xe = r * z;
    var ye = r * 0.66 * w + hmap[z][w] * 1;

    if (ye <= line[z] || hmap[z][w] === 0 && w / water !== (w / water | 0)) {
      pen = false;
    } else {
      if (pen === false) svg.moveTo(xe, 200 - ye);else svg.lineTo(xe, 200 - ye);
      pen = true;
      line[z] = ye;
    }
  }

  return w < size;
}