class Bees extends Enemy {
  constructor(x, y, size, imgArray) {
    super(x, y, size, size, imgArray[0]); 
    this.frames = imgArray;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 5; // 控制翅膀拍動快慢
    this.baseY = y;      // 飛行基準線
    this.floatAngle = random(TWO_PI);
  }

  update(mapManager, physics) {
    if (this.hearts <= 0) { this.isDead = true; return; }
    
    // 垂直飛行 AI：使用正弦波讓 Y 座標平滑上下移動
    // 公式：$y = baseY + \sin(angle) \times amplitude$
    this.floatAngle += 0.08;
    this.pos.y = this.baseY + sin(this.floatAngle) * 60; 
    
    super.update(mapManager, physics);
  
  }

  display() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }

    push();
    // 根據速度方向水平翻轉圖片
    if (this.vel && this.vel.x > 0) {
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1);
      image(this.frames[this.frameIndex], 0, 0, this.width, this.height);
    } else {
      image(this.frames[this.frameIndex], this.pos.x, this.pos.y, this.width, this.height);
    }
    pop();
  }
}