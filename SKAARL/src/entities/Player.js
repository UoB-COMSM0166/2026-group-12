class Player extends GameObject {
  constructor(x, y, img) {
    super(x, y);
    this.img =  img;
    this.width = 90;
    this.height = 60;
    this.state = 'IDLE'; // IDLE, RUN, JUMP, FALL
    this.speed = 5;
    this.jumpForce = -25;
    this.facing = 1; //1 -> left, -1 -> right
    this.isDead = false;
  }

  update(mapManager) {
  // 1. 處理左右移動
  this.handleInput();
  
  // 2. 處理重力並更新位置
  this.vel.y += 0.8; // 重力加速度
  this.pos.y += this.vel.y;
  this.pos.x += this.vel.x;

  // 3. 呼叫物理引擎來修正位置（這會讓玩家站在方塊上）
  Physics.resolveCollision(this, mapManager);
    
  // 限制 X 軸：不讓玩家走出左右邊界
  //this.pos.x = constrain(this.pos.x, 0, width - this.width);

  // Player.js update 函式中
this.pos.x = constrain(this.pos.x, 0, mapManager.gridWidth - this.width);
  // 限制 Y 軸：不讓玩家跳出天花板
  if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = 0; // 撞到天花板後垂直速度歸零
  }

  // 處理掉出地板 (如果掉下去就算死亡)
  if (this.pos.y > height) {
      this.isDead = true; 
  }
}

  handleInput() {
    // 支援方向鍵與 WASD (A: 65, D: 68, W: 87)
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.vel.x = -this.speed;
      this.facing = 1;
    } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.vel.x = this.speed;
      this.facing = -1;
    } else {
      this.vel.x = 0;
    }

    // 跳躍判斷：使用 canJump 而非 vel.y === 0
    if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && this.canJump) {
      this.vel.y = this.jumpForce;
      this.canJump = false; // 跳躍瞬間將標記設為 false，防止二段跳
    }
  }

  display() {
     
    push();

    if (this.facing === -1) {
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1);
      image(this.img, 0, 0, this.width, this.height);
    } else {
      image(this.img, this.pos.x, this.pos.y, this.width, this.height);
    }

    pop();
  }
  
  
}