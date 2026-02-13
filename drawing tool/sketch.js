var Pressed = false;
var Eraser = false;
function setup() {
  cnv = createCanvas(400, 400);
  background(220);
  fill(10, 100, 200);
}

function draw() {
  if(mouseIsPressed){
    noStroke();
    ellipse(mouseX, mouseY, 10, 10);
    if(Pressed === true){
    fill(200, 10, 100);
    for(n = 0; n < 5; n++){
      ellipse(mouseX + random(-5,5), 
              mouseY + random(-5,5), 
              1 + random(5), 
              1 + random(5));
      }
    }
    if(Eraser === true){
      fill(220);
      ellipse(mouseX, mouseY, 20, 20);
    }
  }

}

function keyPressed() {
  if (key === 'c') {
    Pressed = true;
  }
  if(key === 'e'){
    Eraser = true;
  }
  if(key === 's'){
    save(cnv, 'example.jpg');
  }
}