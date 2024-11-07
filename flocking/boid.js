class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.turnFactor = 2;
    this.maxForce = 1;
    this.maxSpeed = 4; // 4
    this.avoidFactor = 5;
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    // this.velocity.add(this.maxSpeed);
  }

  edges() {
    //  clipping the boid towards the opposite side of the screen

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

    // // turning the boid
    // let rightMargin = width - this.margin;
    // let leftMargin = this.margin;
    // let topMargin = this.margin;
    // let bottomMargin = height - this.margin;
    // if (this.position.x > rightMargin) {
    //   this.position.x = 0;
    //   this.velocity.mul(-1);
    // } else if (this.position.x < leftMargin) {
    //   this.velocity.mul(-1);
    // }
    // if (this.position.y > topMargin) {
    //   this.position.y = 0;
    // } else if (bottomMargin) {
    //   this.position.y = height;
    // }
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

  separation(boids) {
    // steering towards average position of local flocking
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
        let diff = p5.Vector.sub(this.position, other.position);
        diff.div(d);
        steering.add(diff);
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

  flock(boids) {
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());
    //  acceleration = force / mass (a unit mass is assumed)
    this.acceleration = separation;
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
