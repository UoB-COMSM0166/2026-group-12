let opacity, brushSize,strokeColor,brush,symmetry;

function setup() {
  createCanvas(800, 600);
  background(240);
  
  textSize(12);
  fill(60);
  text("Press left button to draw, right button to erase;\nPress 'x' to clear the canvas;\nPress '+' the brushsize would get bigger, press '-' the brushsize would get smaller;\nPress 's' would horizontally draw a second point on the opposite side of the canvas, press 'a' to cancell it.",10,20);
  
  opacity = 255;
  brushSize = 10;
  strokeColor=0;
  brush = 0;
  symmetry = 0;
}

function draw() {
  if(mouseIsPressed && mouseButton == LEFT){
    stroke(strokeColor,255-strokeColor,2*strokeColor,opacity);
    strokeWeight(brushSize);

    line(pmouseX, pmouseY, mouseX, mouseY);
    if(symmetry == 1){
      line(800-pmouseX, pmouseY, 800-mouseX, mouseY);
    }
    if(brush == 0){
      brushSize = brushSize-0.1;
    }
    else{
      brushSize = brushSize+0.2;
    }
    opacity = opacity-2;
    strokeColor = strokeColor+5;
    
  }
  
  else if(mouseIsPressed && mouseButton == RIGHT){
    stroke(240);
    strokeWeight(20);

    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  
  else{
    opacity = 255;
    brushSize = 10;
    strokeColor=0;
  } 
}

function keyPressed(){
  if(key == 'x' || key == 'X'){
    background(240);
    noStroke();
    fill(60);
    text("Press left button to draw, right button to erase;\nPress 'x' to clear the canvas;\nPress '+' the brushsize would get bigger, press '-' the brushsize would get smaller;\nPress 's' would horizontally draw a second point on the opposite side of the canvas, press 'a' to cancell it.",10,20);
  }
  if(key == '+'){
    brush = 1;
  }
  if(key == '-'){
    brush = 0;
  }
  if(key == 's' || key == 'S'){
    symmetry = 1;
  }
  if(key == 'a' || key == 'A'){
    symmetry = 0;
  }
}