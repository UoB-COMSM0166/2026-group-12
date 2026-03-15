class Heart extends Entity {
  constructor(x, y, w, h, img) {
    super(x, y, w, h);
    this.img = img;
    this.isDead = false;
  }
  update() {
    this.pos.y += sin(frameCount * 0.1) * 0.5; // 輕微漂浮效果
  }
  onCollide(player) {
    // 只有在血量小於 3 時才補血
    if (uiManager.currentHearts < 3) {
      uiManager.addHeart();
      this.isDead = true;
    }
  }
  display() {
    if (this.img) image(this.img, this.pos.x, this.pos.y, this.width, this.height);
  }
}