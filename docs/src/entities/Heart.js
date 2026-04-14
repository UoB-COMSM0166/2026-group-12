class Heart extends Entity {
  constructor(x, y, w, h, img) {
    super(x, y, w, h);
    this.img = img;
    this.isDead = false;
  }
  update() {
    this.pos.y += sin(frameCount * 0.1) * 0.5; // Floating 
  }
  onCollide(player) {
    // Only consume when the HP is below 3
    if (uiManager.currentHearts < 5) {
      uiManager.addHeart();
      if(player.hearts !== undefined && player.hearts <5){
        sfx.heal.play();
        player.hearts++;
      }
            
    }
    this.isDead = true;
  }
  display() {
    if (this.img) image(this.img, this.pos.x, this.pos.y, this.width, this.height);
  }
}