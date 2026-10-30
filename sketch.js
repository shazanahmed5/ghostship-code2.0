let lion = { x: 240, y: 180, s: 1 };
let score = 0, combo = 0, lastHit = 0;
let startTime, over = false;
let bits = [], pops = [], stars = [];
const TIME = 30;
const btn = { x: 180, y: 215, w: 120, h: 40 };

function setup() {
  createCanvas(480, 360);
  for (let i = 0; i < 50; i++) {
    stars.push({ x: random(width), y: random(height), r: random(1, 3), sp: random(0.02, 0.08) });
  }
  restart();
}

function restart() {
  score = 0;
  combo = 0;
  over = false;
  bits = [];
  pops = [];
  startTime = millis();
  moveLion();
}

function moveLion() {
  lion.x = random(40, width - 40);
  lion.y = random(40, height - 40);
  lion.s = 1.3;
}

function overBtn() {
  return mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;
}

function draw() {
  background(11, 12, 16);

  noStroke();
  for (let st of stars) {
    fill(255, 255, 200, map(sin(frameCount * st.sp + st.x), -1, 1, 50, 255));
    ellipse(st.x, st.y, st.r);
  }

  let left = max(0, TIME - (millis() - startTime) / 1000);
  if (left <= 0) over = true;
  if (millis() - lastHit > 2000) combo = 0;

  if (!over) {
    lion.x = constrain(lion.x + random(-4, 4), 35, width - 35);
    lion.y = constrain(lion.y + random(-4, 4), 35, height - 35);
    lion.s = lerp(lion.s, 1, 0.1);
    if (frameCount % 60 == 0) moveLion();
    drawLion(lion.x, lion.y, lion.s);
  } else {
    fill(0, 180);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text("Game Over!", width / 2, 140);
    textSize(18);
    text("Final Score: " + score, width / 2, 180);
    fill(overBtn() ? color(255, 140, 0) : color(255, 102, 0));
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    fill(255);
    textSize(16);
    text("Play Again", width / 2, btn.y + btn.h / 2);
  }

  for (let i = bits.length - 1; i >= 0; i--) {
    let b = bits[i];
    b.x += b.vx;
    b.y += b.vy;
    b.a -= 8;
    fill(255, b.g, 0, b.a);
    ellipse(b.x, b.y, b.size);
    if (b.a <= 0) bits.splice(i, 1);
  }

  for (let i = pops.length - 1; i >= 0; i--) {
    let p = pops[i];
    p.y -= 1.5;
    p.a -= 5;
    fill(255, 215, 0, p.a);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(p.msg, p.x, p.y);
    if (p.a <= 0) pops.splice(i, 1);
  }

  if (!over) {
    fill(255);
    textSize(16);
    textAlign(LEFT, TOP);
    text("Score: " + score, 12, 10);
    if (combo > 1) {
      fill(255, 180, 0);
      text("Combo x" + combo, 12, 32);
    }
    fill(255);
    textAlign(RIGHT, TOP);
    text("Time: " + ceil(left), width - 12, 10);
  }
}

function drawLion(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  fill(204, 102, 0);
  ellipse(0, 0, 75);
  fill(230, 165, 75);
  ellipse(-22, -22, 18);
  ellipse(22, -22, 18);
  fill(255, 200, 150);
  ellipse(-22, -22, 10);
  ellipse(22, -22, 10);
  fill(230, 165, 75);
  ellipse(0, 0, 55);
  fill(255, 235, 205);
  ellipse(-7, 7, 16, 14);
  ellipse(7, 7, 16, 14);
  fill(60, 30, 10);
  triangle(-6, 2, 6, 2, 0, 8);
  stroke(30);
  strokeWeight(2);
  noFill();
  arc(-12, -7, 10, 8, PI, TWO_PI);
  arc(12, -7, 10, 8, PI, TWO_PI);
  pop();
}

function mousePressed() {
  if (over) {
    if (overBtn()) restart();
    return;
  }
  if (dist(mouseX, mouseY, lion.x, lion.y) > 35) return;

  combo = millis() - lastHit < 2000 ? combo + 1 : 1;
  lastHit = millis();
  score += combo;
  lion.s = 1.5;

  for (let i = 0; i < 12; i++) {
    let a = random(TWO_PI), sp = random(2, 6);
    bits.push({ x: lion.x, y: lion.y, vx: cos(a) * sp, vy: sin(a) * sp, size: random(4, 8), g: random(150, 220), a: 255 });
  }
  pops.push({ x: lion.x, y: lion.y - 20, msg: "+" + combo, a: 255 });
  moveLion();
}

function keyPressed() {
  if (over && (key == ' ' || key == 'r')) restart();
}