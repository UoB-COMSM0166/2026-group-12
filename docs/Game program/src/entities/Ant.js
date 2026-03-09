class Ant extends Enemy {
  constructor(x, y, size) {
    super(x, y, size, size, antImgs[0]); 

    this.frames = antImgs;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 10;
    if (size === 80){
      this.hearts = 2;
    } else if (size === 100){
      this.hearts = 3;
    }
  }

  display() {
    if (this.hearts <= 0) return;

    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }

    let currentImg = this.frames[this.frameIndex];

    push();
    if (this.vel.x > 0) {
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1);
      image(currentImg, 0, 0, this.width, this.height);
    } else {
      image(currentImg, this.pos.x, this.pos.y, this.width, this.height);
    }
    pop();
  }
}