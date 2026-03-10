class Bees extends Enemy {
  constructor(x, y, size, beeImgs) {
    // 呼叫父類別 Enemy 的建構子
    super(x, y, size, size, beeImgs[0]); 

    this.frames = beeImgs;      // 使用傳入的蜜蜂動畫陣列
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 8;        // 飛行生物翅膀拍動通常快一點，所以數值調小
    
    // 飛行特有屬性
    this.baseY = y;             // 紀錄初始飛行高度
    this.floatAngle = random(TWO_PI); // 隨機起始角度，讓群體更有層次感
    
    // 生命值設定 (延用螞蟻的邏輯)
    if (size >= 80 && size < 100) {
      this.hearts = 2;
    } else if (size >= 100) {
      this.hearts = 3;
    } else {
      this.hearts = 1;
    }
  }

  update(mapManager, physics) {
    if (this.hearts <= 0) {
      this.isDead = true;
      return;
    }

    // --- 核心 AI：上下移動 ---
    this.floatAngle += 0.06; // 飄浮速度
    // 讓 y 座標在 baseY 附近上下 50 像素擺動
    this.pos.y = this.baseY + sin(this.floatAngle) * 50;

    // 呼叫父類別處理水平移動 (例如撞牆迴轉)
    // 註：若 Enemy 有重力邏輯，可能需要微調 physics 讓 Bees 不會墜落
    super.update(mapManager, physics);
  }

  display() {
    if (this.hearts <= 0) return;

    // 處理動畫幀切換
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }

    let currentImg = this.frames[this.frameIndex];

    push();
    // 根據水平速度翻轉圖片 (延用 Ant 的邏輯)
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