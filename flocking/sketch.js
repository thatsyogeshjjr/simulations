const flock = [];

function setup() {
  createCanvas(640, 360);
  flock.push(new Boid());
}

function draw() {
  background(51);
  for (let boid of flock) {
    boid.update();
    boid.show();
  }
}
