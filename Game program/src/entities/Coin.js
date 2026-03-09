class Coin extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.scoreValue = 100;

    this.isDead = false;
  }

  update() {
    // 讓金幣上下漂浮的小動畫 (數學練習：Sin Wave)
    this.pos.y += sin(frameCount * 0.1) * 0.5;
  }

  onCollide(player) {
    this.isDead = true;
    // 呼叫全局計分
    gameStats.score += this.scoreValue;
  }

  display() {
    fill(255, 215, 0);
    ellipse(this.pos.x, this.pos.y, 30);
  }
}