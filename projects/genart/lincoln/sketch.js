let cell_width = 1000
let cell_height = 1140
let scale_factor = 1
let color_pairs = [[[238,66,102], [255,210,63]],
                    [[84,13,110], [238,66,102]],
                    [[14,173,105], [59,206,172]]]

let data;
function processArray(data) {
  data.forEach((val, index) => {
    val = val.split(",")
    data[index] = [parseInt(val[0]),
                   parseInt(val[1]),
                   parseInt(val[2])]
    });
  data = rescaleImage(data);

  return data
}

function rescaleImage(data) {
  data.forEach((val, index) => {
    data[index] = [parseInt(val[0] / scale_factor),
                   parseInt(val[1] / scale_factor),
                   parseInt(val[2])]
    });

  return data
}

function preload() {
  data = loadStrings('data/sampled_image.csv', processArray);
}

function setup() {
  createCanvas(parseInt(cell_width / scale_factor),  parseInt(cell_height / scale_factor));
  noLoop();
}

function draw() {
  // c = random(color_pairs);
  let c = color_pairs[0]
  background(c[1]);
  drawImage(data, c);
}


function drawImage(data, c) {
  c = color(c[0]);
  c.setAlpha(120);

  data.forEach((p) => {
    let x = Math.floor(p[1]);
    let y = Math.floor(p[0]);
    noStroke()
    fill(color(c))
    
    rect(x, y, 2+ p[2] **2, 2);

  });
}