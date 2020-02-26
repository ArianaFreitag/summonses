var numBalls = 15;
var spring = 0.05;
var gravity = 0.03;
var friction = -0.9;
var balls = [];

var overBox = new Array(numBalls);
var locked = new Array(numBalls);

function setup() {
  createCanvas(1300, 700);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height),
      random(30, 70),
      i,
      balls
    );
  }
  noStroke();
  fill(255, 204);
}

function draw() {
  background(0);
  balls.forEach((ball, i) => {
    // ball.mouseDragged();
    // ball.mousePressed();
    // ball.mouseReleased();
    ball.collide();
    ball.move();

    if (
      mouseX > ball.x - ball.diameter &&
      mouseX < ball.x + ball.diameter &&
      mouseY > ball.y - ball.diameter &&
      mouseY < ball.y + ball.diameter
    ) {
      console.log("mouse over");
      overBox[i] = true;
    } else {
      overBox[i] = false;
    }
    ball.display();
  });
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;
    this.xOffset = 0.0;
    this.yOffset = 0.0;
  }

  collide() {
    if (!locked[this.id]) {
      for (let i = this.id + 1; i < numBalls; i++) {
        // console.log(others[i]);
        let dx = this.others[i].x - this.x;
        let dy = this.others[i].y - this.y;
        let distance = sqrt(dx * dx + dy * dy);
        let minDist = this.others[i].diameter / 2 + this.diameter / 2;
        //   console.log(distance);
        //console.log(minDist);
        if (distance < minDist) {
          //console.log("2");
          let angle = atan2(dy, dx);
          let targetX = this.x + cos(angle) * minDist;
          let targetY = this.y + sin(angle) * minDist;
          let ax = (targetX - this.others[i].x) * spring;
          let ay = (targetY - this.others[i].y) * spring;
          this.vx -= ax;
          this.vy -= ay;
          this.others[i].vx += ax;
          this.others[i].vy += ay;
        }
      }
    }
  }

  move() {
    let grav;
    if (locked[this.id]) {
      grav = 0;
    } else {
      grav = gravity;
    }
    this.vy += grav;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    rect(this.x, this.y, this.diameter, this.diameter);
  }
}

function mouseReleased() {
  balls.forEach(ball => {
    locked[ball.id] = false;
  });
}

function mouseDragged() {
  balls.forEach(ball => {
    if (overBox[ball.id]) {
      if (locked[ball.id]) {
        ball.x = mouseX - ball.xOffset;
        ball.y = mouseY - ball.yOffset;
      }
    }
  });
}

function mousePressed() {
  balls.forEach(ball => {
    if (overBox[ball.id]) {
      locked[ball.id] = true;
      console.log(locked[ball.id]);
    } else {
      locked[ball.id] = false;
    }
    ball.xOffset = mouseX - ball.x;
    ball.yOffset = mouseY - ball.y;
  });
}

// function mousePressed() {
//   // Did I click on the rectangle?
//   if (mouseX > ball.x && mouseX < ball.x + ball.diameter && mouseY > ball.y && mouseY < ball.y + ball.diameter) {
//     dragging = true;
//     // If so, keep track of relative location of click to corner of rectangle
//     offsetX = x - mouseX;
//     offsetY = y - mouseY;
//   }
// }
//
// function mouseReleased() {
//   // Quit dragging
//   dragging = false;
// }
