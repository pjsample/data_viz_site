const canvas_width = 1000
const canvas_height = 800

function setup() {
  createCanvas(canvas_width, canvas_height);
  angleMode(DEGREES);
  ellipseMode(CENTER)
  noLoop()
}

function draw() {
  background('#CAF7E3');
  placeRandomly()
}

function placeOrderly() {
  let nrows = 10
  let ncols = 6
  let row_spacing = canvas_height / nrows
  let col_spacing = canvas_width / ncols

  for (let row = 1; row < nrows + 1; row++) {
    for (let col = 0; col < ncols; col++) {
      if (random() >= 0.1){
        box = new CandyBox(row * row_spacing, col * col_spacing, 0.9, 0)
        box.drawBox()
      }
    }
  }
}

function placeRandomly() {
  let box;
  for (let scale = 0.6; scale < 1.2; scale = scale + 0.2) {
    let num_to_draw = 8 / scale ** 3
    for (let i = 0; i < num_to_draw; i++) {
        box = new CandyBox(random(0, canvas_width - 100), random(0,canvas_height - 100), scale, random(-45, 45))
        box.drawBox()
    }
  }
}

class CandyBox {
  constructor(x, y, scale, rotation) {
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.rotation = rotation;
    this.box_width = 70 * scale;
    this.box_height = 120 * scale;
    this.box_color = 'white'; 
    this.side_color = '#01937C';
    this.fruit_color = '#FF005C'
    this.fruit_size = 20 * scale;
    this.ncols = 2
    this.nrows = 4
    this.padding = 30
  }

  drawBox() {
    push()
      translate(this.x, this.y)
      rotate(this.rotation)
      noStroke()
      fill(this.box_color)
      rect(0, 0, this.box_width, this.box_height)
      fill(this.side_color)
      noStroke()
      quad(0, this.box_height,
        this.box_width, this.box_height,
        parseInt(this.box_width / 5 + this.box_width), parseInt(this.box_height / 10 + this.box_height),
        parseInt(this.box_width / 5), parseInt(this.box_height / 10 + this.box_height))
      
        quad(this.box_width, 0,
          parseInt(this.box_width / 5 + this.box_width), parseInt(this.box_height / 10),
          parseInt(this.box_width / 5 + this.box_width), parseInt(this.box_height / 10 + this.box_height),
          this.box_width, this.box_height)
    pop()
    let r = random()
    if (r > 0.999) {
      this.drawBanana()
    } else {
      this.drawCherry()
    }
    
  }

  addLogo() {
    stroke('grey')
    strokeWeight(3 * this.scale)

    line(this.box_width / 3, this.box_height / 10,
         this.box_width - this.box_width / 3, this.box_height / 10)

    line(this.box_width / 4, 1.5 * (this.box_height / 10),
         this.box_width - this.box_width / 4, 1.5 * (this.box_height / 10))
  }

  drawBanana() {
    push()
      translate(this.x, this.y)
      rotate(this.rotation)

      stroke('black')
      fill('yellow')
        beginShape();
          vertex(30 * this.scale, 20* this.scale);
          vertex(40 * this.scale, 15 * this.scale);
          vertex(50 * this.scale, 25 * this.scale);
          vertex(60 * this.scale, 45 * this.scale);
          vertex(60 * this.scale, 65 * this.scale);
          vertex(60 * this.scale, 85 * this.scale);
          vertex(40 * this.scale, 105 * this.scale);
          vertex(31 * this.scale, 110 * this.scale);
          vertex(25 * this.scale, 110 * this.scale)
          vertex(20 * this.scale, 105 * this.scale);
          vertex(30 * this.scale, 75 * this.scale);
          vertex(30 * this.scale, 75 * this.scale);
          vertex(30 * this.scale, 45 * this.scale);
        endShape(CLOSE);
      beginShape();
        vertex(25 * this.scale, 15 * this.scale);
        vertex(35 * this.scale, 10 * this.scale);
        vertex(45 * this.scale, 20 * this.scale);
        vertex(55 * this.scale, 40 * this.scale);
        vertex(55 * this.scale, 60 * this.scale);
        vertex(55 * this.scale, 80 * this.scale);
        vertex(35 * this.scale, 100 * this.scale);
        vertex(25 * this.scale, 110 * this.scale);
        vertex(15 * this.scale, 100 * this.scale);
        vertex(25 * this.scale, 70 * this.scale);
        vertex(25 * this.scale, 70 * this.scale);
        vertex(25 * this.scale, 40 * this.scale);
      endShape(CLOSE);

      this.addLogo()

    pop()
  }

  drawCherry() {
    let col_spacing = (this.box_width) / (this.ncols + 1)
    let row_spacing = this.box_height / (this.nrows + 1)

    push()
      translate(this.x, this.y)
      rotate(this.rotation)

      this.addLogo()

      for (let col = 0; col < this.ncols; col++) {
        for (let row = 0; row < this.nrows; row++) {
          if (row == 0) { continue; }
          let x = col_spacing * (col + 1)
          let y = row_spacing * (row +1 )
          fill(this.fruit_color)
          noStroke()
          circle(x, y, this.fruit_size)

          stroke('#54E346')
          strokeWeight(3 * this.scale)

          let p1 = {x: x, y: y - this.fruit_size  * 0.2}
          let p2 = {x: x, y: p1.y}
          let p3 = {x: p1.x + this.fruit_size * 0.5,
                    y: p1.y - this.fruit_size * 0.5}
          let p4 = {x: p3.x + this.fruit_size * 2,
                    y: p3.y}

          curve(p1.x,  p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)
        }
      }
    pop()
  }
}

