class Entity extends GameObject {
  constructor(x, y, type) {
    super(x, y);
    this.type = type; // 'ENEMY', 'COIN', 'HEAL'
    this.scoreValue = 0;
  }

  // 這裡寫所有動態物件通用的邏輯
  checkPlayerCollision(player) {
    let d = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);
    if (d < (this.width + player.width) / 2) {
      this.onCollide(player);
    }
  }

  onCollide(player) {
    // 抽象方法，交給子類別實作
  }
}

