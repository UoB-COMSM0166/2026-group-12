class Physics {
  static resolveCollision(player, mapManager) {
    let walls = mapManager.getWalls(); // 取得地圖中所有的方塊
    
    // 這裡我們假設玩家只有「向下掉」的地面碰撞
    for (let wall of walls) {
      if (this.isRectOverlap(player, wall)) {
        
        // 檢查玩家是否正從上方落下 (Player 的底部在 Wall 的頂部附近)
        if (player.vel.y > 0 && (player.pos.y + player.height - player.vel.y) <= wall.y) {
          player.pos.y = wall.y - player.height; // 強制把玩家推回方塊上方
          player.vel.y = 0;                      // 停止向下掉的速度
          player.state = 'IDLE';                 // 回到站立狀態
          player.canJump = true;                 // 允許再次跳躍
        }
       
      }
    }
  }

  static isRectOverlap(r1, r2) {
  // r1 是 Player (有 pos.x, pos.y, width, height)
  // r2 是 Wall (Tiled 傳回的物件，有 x, y, w, h)
  return r1.pos.x < r2.x + r2.w &&
         r1.pos.x + r1.width > r2.x &&
         r1.pos.y < r2.y + r2.h &&
         r1.pos.y + r1.height > r2.y;
}
}