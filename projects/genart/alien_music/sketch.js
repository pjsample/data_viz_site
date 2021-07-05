const canvas_width = 700
const canvas_height = 900
const num_lines = 80
const left_pad = 100
const right_pad = 100
const top_pad = 50
const bottom_pad = 50
const line_spacing = parseInt((canvas_height - top_pad - bottom_pad) / num_lines)
const max_lines_in_block = 12

const bg_cell_size = 2

let columns = [];

function setup() {
  createCanvas(canvas_width, canvas_height);
  angleMode(DEGREES);
  ellipseMode(CENTER)
  rectMode(CENTER)
  noLoop()
}

function draw() {
  // background('#FEF7DC');
  background('#F0EBCC')
  // makeBackground(bg_cell_size)
  addColumns(6)

  let current_line = 1;
  let lines_in_block;

  while (current_line <= num_lines) {

    if (current_line + max_lines_in_block > num_lines) {
      lines_in_block = num_lines - current_line
    } else {
      lines_in_block = parseInt(random(6, 12))
    }

    let b = new Block(left_pad, top_pad + (current_line * line_spacing), lines_in_block)
    b.drawBorders()
    b.drawKeyLines(random([0.5, 0.75, 0.9]))

    current_line += lines_in_block + 1
  } 
}

function makeBackground(bg_cell_size) {
  let c;
  noStroke()
  for (let col = 1; col < ceil(canvas_width / bg_cell_size); col++)
  {
    for (let row = 1; row < ceil(canvas_height / bg_cell_size); row++)
    {
      c = chooseBgCellColor()
      fill(c)
      square(col * bg_cell_size, row * bg_cell_size, bg_cell_size)
    }
  }
}

function chooseBgCellColor() {
  let r = random()

  if (r < 0.95) {
    return '#F0EBCC'
  } else if (r < 0.99) {
    return '#E7D4B5'
  } else {
    return '#FDFAF6'
  }

}


class Block {
  constructor(x, y, block_size) {
    this.x = x;
    this.y = y;
    this.block_size = block_size;
  }

  drawBorders() {
    push()
    translate(0, this.y + this.block_size * line_spacing)
    let start_x = left_pad - 20
    stroke('grey')
    strokeWeight(1)
    line(start_x + 7, 0, canvas_width - right_pad + 15, 0)
    fill('grey')
    circle(start_x - 10 , 0, 6)
    circle(start_x, 0, 4)
    stroke('grey')
    strokeWeight(1)
    noFill()
    arc(canvas_width - right_pad + 15, 0, 20, 20, 210, 150) // 5 * PI, 7 * PI
    // let symbol = String.fromCharCode(0x0F3B) //0x0FD1
    // textSize(40);
    // text(symbol, canvas_width - right_pad - 20, this.y)
    pop()
  }

  drawKeyLines(prob) { 
    push()
    translate(this.x, this.y)
    stroke('grey')
    
    if (random() > 0.1){
      this.keyLinesFromEdge(prob)
    } else {
      this. keyLinesFromColumn(prob)
    }
    pop()
  }

  keyLinesFromEdge(prob) {
    let end_x = random(columns) - this.x

    for (let i = 1; i < this.block_size - 1; i++) {
        let y = i * line_spacing
        let start_x = parseInt(random(0, 30))

        if (random() <= prob) {
          strokeWeight(random(2, 2.5))
          line(start_x, y, end_x + parseInt(random(0, 7)), y);
          this.addNotes(random(0,6), start_x, end_x, y)
        }
    }
  }

  keyLinesFromColumn(prob) {
    let end_x =  canvas_width - this.x - left_pad

    for (let i = 0; i < this.block_size - 1; i++) {
        let y = i * line_spacing
        let start_x = columns[0] - this.x

        if (random() < prob) {
          strokeWeight(random(2, 2.5))
          line(start_x, y, end_x, y);
          this.addNotes(random(0,6), start_x, end_x, y)
        }
    }
  }

  addNotes(num_notes, start_x, end_x, y) {
    for (let i = 0; i < num_notes; i++) {
      let x = random(start_x, end_x)
      push()
      strokeWeight(1)
      fill(random(['#CD113B', '#185ADB', '#FFC947', 'green']))
      circle(x, y, 8)
      pop()
    }
  }

}


function addColumns(num_cols) {
  let options = []
  
  for (let i = 340; i <= (canvas_width - right_pad); i = i + 20) {
    options.push(i)
  }

  for (let i = 0; i < num_cols; i++) {
    let choice = random(options)
    columns.push(choice)
    options.pop(choice)

    stroke('grey')
    strokeWeight(random([1, 1.5, 2.5]))
    line(choice, top_pad, choice, canvas_height - bottom_pad)
  }
  columns = columns.sort()
}
