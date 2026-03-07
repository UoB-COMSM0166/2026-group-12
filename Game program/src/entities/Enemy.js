class Enemy extends Figure {
  constructor(x, y, w, h, img) {
    super(x, y, 'ENEMY');
    this.img = img;
    this.width = w;
    this.height = h;
    this.hearts = 1;
    this.speed = 2;
    this.vel.x = this.speed;
    this.startX = x;
    this.patrolRange = 250;
  }

  update(mapManager) {
    // check alive
    if (this.hearts <= 0) {
      this.isDead = true;
      return;
    }

    // Detect whether there is a tile on the ground ahead
    let checkX = this.vel.x > 0
        ? this.pos.x + this.width + 5
        : this.pos.x - 5;
    let tileAhead = mapManager.getTileAt(checkX, this.pos.y + this.height + 5);

    // turn around when: no ground ahead, collision with wall, or patrol range exceeded
    if (tileAhead === 0 || this.onWallLeft || this.onWallRight ||
        Math.abs(this.pos.x - this.startX) > this.patrolRange) {
      this.vel.x *= -1;
    }

    physics.update(this);
  }

  onCollide(player) {
    // 1. 擺盪攻擊 (身體具備攻擊力)
    if (player.isHooked) {
      this.hearts--;
      return; 
    }

    // 2. 被踩踏判定 
    let isStomping = player.vel.y > 0 && (player.pos.y + player.height) < (this.pos.y + this.height * 0.25);
    if (isStomping) {
      this.hearts--;
      player.vel.y = -18; 
      return;
    }

    // 3. 實心個體排斥邏輯
    // 如果玩家沒有在攻擊，我們將玩家「推開」到怪物邊緣，防止重疊
    if (player.pos.x + player.width / 2 < this.pos.x + this.width / 2) {
      // 玩家在左邊，推到怪物左側
      player.pos.x = this.pos.x - player.width;
    } else {
      // 玩家在右邊，推到怪物右側
      player.pos.x = this.pos.x + this.width;
    }

    // 4. 觸發受傷擊退
    player.takeDamage(this.pos.x + this.width / 2);
  }

  display() {
    if (this.hearts <= 0) return;
    push();
    if (this.vel.x < 0) {
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1);
      image(this.img, 0, 0, this.width, this.height);
    } else {
      image(this.img, this.pos.x, this.pos.y, this.width, this.height);
    }
    pop();
  }
}