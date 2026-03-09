class Enemy extends Figure {
  constructor(x, y, w, h, img) {
    super(x, y, w, h, 'ENEMY');
    this.img = img;

    this.hearts = 1;
    this.speed = 2;
    this.patrolRange = 100;
    this.startX = x;

    this.vel.x = this.speed;
  }

  update(mapManager) {
    if (this.hearts <= 0) {
      this.isDead = true;
      return;
    }
    this.behavior(mapManager);
    physics.update(this);
  }

  behavior(mapManager) {
    this.patrol(mapManager);
  }
  
  takeDamage(amount = 1) {
    this.hearts -= amount;
  }

  onCollide(player) {

    if (player.isHooked) {
      this.takeDamage();
      return;
    }
    
    const isStomping =
      player.vel.y > 0 &&
      player.bottom < this.pos.y + this.height * 0.25;
    if (isStomping) {
      this.takeDamage();
      player.vel.y = -18;
      return;
    }

    if (player.pos.x + player.width / 2 < this.pos.x + this.width / 2) {
      player.pos.x = this.left - player.width;
    } else {
      player.pos.x = this.right;
    }

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

  patrol(mapManager) {
    let checkX;
    if (this.vel.x > 0) {
        checkX = this.right + 5;
    } else {
        checkX = this.left - 5;
    }

    let tileAhead = mapManager.getTileAt(checkX, this.bottom + 5);

    if (
      tileAhead === 0 ||
      this.onWallLeft ||
      this.onWallRight ||
      Math.abs(this.pos.x - this.startX) > this.patrolRange
    ) {
      this.vel.x *= -1;
    } else {
      this.vel.x = this.speed * Math.sign(this.vel.x);
    }
  }
}


