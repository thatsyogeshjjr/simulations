class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    // this.velocity.add(this.maxSpeed);
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    let perception = 30;
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
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity); // steering force = desired velocity - current velocity
      steering.limit(this.maxForce);
    }

    return steering;
  }

  cohesion(boids) {
    // steering towards average position of local flocking
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
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);

      steering.sub(this.position);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity); // steering force = desired velocity - current velocity
      steering.limit(this.maxForce);
    }

    return steering;
  }

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    this.acceleration = alignment; //  acceleration = force / mass (a unit mass is assumed)
    this.acceleration.add(cohesion);
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
