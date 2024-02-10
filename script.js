const G_CONSTANT = 6.67 * (10 ^ -11)

let Freebodies = []
let Sun = null;

class Massive {
  constructor(radius, mass, col, pos) {
    this.radius = radius
    this.mass = mass
    this.col = col
    this.pos = pos
  }

  drawFigure() {
    push()

    fill(this.col)

    ellipse(this.pos.x, this.pos.y, this.radius, this.radius)
  }
}

class Freebody {
  constructor(radius, mass, col, pos, vel) {
    this.radius = radius
    this.mass = mass
    this.col = col
    this.pos = pos
    this.vel = vel
    this.id = Freebodies.length
  }

  drawFigure() {
    push()
    // Main circle
    noFill();
    stroke(this.col);

    ellipse(this.pos.x, this.pos.y, this.radius, this.radius)

    fill(this.col);
    ellipse(this.pos.x, this.pos.y, 5, 5);

    // Velocity arrow
    stroke("blue")
    strokeWeight(5)
    let arrowV = p5.Vector.mult(this.vel, 5)
    let endpoint = p5.Vector.add(this.pos, arrowV)
    line(this.pos.x, this.pos.y, endpoint.x, endpoint.y)
    pop()
  }

  move() {
    this.pos.add(this.vel)

    // bounce off walls
    if ((this.pos.x >= windowWidth - this.radius) || (this.pos.x <= this.radius)) {
      this.vel.x *= -0.3
      // this.vel.mult(0)
    }

    if ((this.pos.y >= windowHeight - this.radius) || (this.pos.y <= this.radius)) {
      this.vel.y *= -0.3
      // this.vel.mult(0)
    }
  }

  acc() {
    // Add up all forces for acceleration
    let acceleration = createVector(0, 0)

    if (Sun != null) {
      let force = p5.Vector.sub(Sun.pos, this.pos)
      let distance = Sun.pos.dist(this.pos)
      let forceMagnitude = G_CONSTANT * (Sun.mass * this.mass) / (distance ^ 2)
      force.normalize()
      force.mult(-forceMagnitude)
      acceleration.add(force)
    }

    for (let i = 0; i < Freebodies.length; i++) {
      if (i != this.id) {
        let force = p5.Vector.sub(Freebodies[i].pos, this.pos)
        let distance = Freebodies[i].pos.dist(this.pos)
        let forceMagnitude = G_CONSTANT * (Freebodies[i].mass * this.mass) / (distance ^ 2)
        force.normalize()
        force.mult(-forceMagnitude)
        acceleration.add(force)
      }
    }

    // Add acceleration to velocity, and then draw an acceleration arrow
    this.vel.add(acceleration)
    // let arrowA = p5.Vector.normalize(acceleration)
    // arrowA.mult(this.radius)
    push()
    stroke("red")
    strokeWeight(5)
    let accLine = p5.Vector.mult(acceleration, this.radius * 5)
    // let accLine = p5.Vector.mult(acceleration, 50)
    line(this.pos.x, this.pos.y, this.pos.x + accLine.x, this.pos.y + accLine.y)
    pop()
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i=0; i<10; i++) {
    let mass = random(0.5,1.5)
    let radius = 20 * mass
    let pos = createVector(windowWidth/2, windowHeight/2)
    let axis = p5.Vector.random2D().mult(100)
    pos.add(axis)
    let vel = p5.Vector.random2D().mult(5)
    let Planet = new Freebody(radius, mass, color(random(255), random(255), random(255)), pos, vel)
    Freebodies.push(Planet)
  }

  // let pos = createVector(windowWidth / 2, windowHeight / 2)
  // pos.add(createVector(-300, 0))
  // let vel = createVector(0, 4)
  // let Planet = new Freebody(80, 2, "green", pos, vel)
  // Freebodies.push(Planet)

  // let pos2 = createVector(windowWidth / 2, windowHeight / 2)
  // pos2.add(createVector(300, 0))
  // let vel2 = createVector(0, -6)
  // let Planet2 = new Freebody(40, 1, "purple", pos2, vel2)
  // Freebodies.push(Planet2)

  // pos = createVector(windowWidth / 2, windowHeight / 2)
  // Sun = new Massive(100, 10, "yellow", pos)
}

function draw() {
  background(0);

  if (Sun != null) {
    Sun.drawFigure()
  }

  for (let i = 0; i < Freebodies.length; i++) {
    Freebodies[i].drawFigure()
    Freebodies[i].move()
    Freebodies[i].acc()
  }

  textSize(40);
  textAlign(LEFT)
  fill('red')
  text('-- Acceleration', 30, windowHeight - 100)
  fill('blue')
  text('-- Velocity', 30, windowHeight - 60)
  textAlign(RIGHT)
  fill('yellow')
  text('Click to sun', windowWidth - 30, windowHeight - 60)

  if (mouseIsPressed == true) {
    let pos = createVector(mouseX, mouseY)
    Sun = new Massive(300, 20, "yellow", pos)
  } else if (mouseIsPressed == false) {
    Sun = null;
  }
}

// function mousePressed() {
//   if (Sun == null) {  
//     let pos = createVector(mouseX, mouseY)
//     Sun = new Massive(100, 10, "yellow", pos)
//   }
// }

// function mouseReleased() {
//   if (Sun != null) {
//     Sun = null;
//   }
// }