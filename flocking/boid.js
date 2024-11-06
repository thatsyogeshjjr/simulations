class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 1;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    let perception = 50;
    for (let other of boids) {
      let d = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );

      if (other != this && d < perception) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.velocity); // steering force = desired velocity - current velocity
      steering.limit(this.maxForce);
    }

    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    this.acceleration = alignment; //  acceleration = force / mass (a unit mass is assumed)
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
