class Physics {
  constructor(MapManager) {
    this.MapManager = MapManager;
    this.tileSize = MapManager.tileSize;

    this.gravity = 1;
    this.maxFallSpeed = 16;
  }


  update(figure) {
    figure.resetCollisionState();

    // apply gravity
    figure.vel.y += this.gravity;

    figure.vel.y = min(figure.vel.y, this.maxFallSpeed);

    // update position according to figure's velocity and state
    this.moveX(figure);
    this.moveY(figure);

  }

  // resolve horizontal movement and collisions according to velocity
  moveX(e) {
    e.pos.x += e.vel.x;

    let leftTile = floor((e.left) / this.tileSize);
    let rightTile = floor((e.right) / this.tileSize);
    let topTile = floor((e.top+1) / this.tileSize);
    let bottomTile = floor((e.bottom-1) / this.tileSize);

    if (e.vel.x > 0) {
      // moving right
      for (let ty = topTile; ty <= bottomTile; ty++) {
        if (this.MapManager.isSolid(rightTile, ty)) {
          e.pos.x = rightTile * this.tileSize - e.width;
          e.vel.x = 0;
          e.onWallRight = true;
          break;
        }
      }
    }

    else if (e.vel.x < 0) {
      // moving left
      for (let ty = topTile; ty <= bottomTile; ty++) {
        if (this.MapManager.isSolid(leftTile, ty)) {
          e.pos.x = (leftTile + 1) * this.tileSize;
          e.vel.x = 0;
          e.onWallLeft = true;
          break;
        }
      }
    }

  }

  // resolve vertical movement and collisions according to velocity
  moveY(e) {
    e.pos.y += e.vel.y;

    let leftTile = floor((e.left+1) / this.tileSize);
    let rightTile = floor((e.right-1) / this.tileSize);
    let topTile = floor((e.top) / this.tileSize);
    let bottomTile = floor((e.bottom) / this.tileSize);

    if (e.vel.y > 0) {
      // falling
      for (let tx = leftTile; tx <= rightTile; tx++) {
        if (this.MapManager.isSolid(tx, bottomTile)) {
          e.pos.y = bottomTile * this.tileSize - e.height;
          e.vel.y = 0;
          e.onGround = true;
          break;
        }
      }
    }

    else if (e.vel.y < 0) {
      // hitting ceiling
      for (let tx = leftTile; tx <= rightTile; tx++) {
        if (this.MapManager.isSolid(tx, topTile)) {
          e.pos.y = (topTile + 1) * this.tileSize;
          e.vel.y = 0;
          e.hitCeiling = true;
          break;
        }
      }
    }

  }

}