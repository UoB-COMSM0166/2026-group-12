class GoalEgg extends Entity {
  constructor(x, y, w, h, img, level) {
    super(x, y, w, h);
    this.img = img;
    this.level = level;
    this.isDead = false;
  }
  update() {
    this.pos.y += sin(frameCount * 0.05) * 0.3; // floating effects
     
  }
  onCollide(player){
    if(typeof uiManager !=='undefined'){
    uiManager.hasegg = true;
    this.isDead = true;
    console.log("Got the egg");
    }
  }
  display() {
    if (this.img) image(this.img, this.pos.x, this.pos.y, this.width, this.height);
    // The number label on the egg
    push();
    fill(55);
    textAlign(CENTER, CENTER);
    textSize(30);
    textStyle(BOLD);
    text(this.level, this.pos.x + this.width/2, this.pos.y + this.height/2);
    pop();
  }
}