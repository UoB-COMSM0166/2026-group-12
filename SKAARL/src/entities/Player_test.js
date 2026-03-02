class Player extends GameObject {
  constructor(x, y, w, h, img) {
    super(x, y);
    this.img = img;
    this.width = w;
    this.height = h;
    this.state = 'IDLE'; 
    this.speed = 5;
    this.jumpForce = -25;
    this.facing = 1; // 1: Left, -1: Right
    this.isDead = false;
    this.canJump = false;

    // --- 扇形擺盪設定 ---
    this.isHooked = false;
    this.hookPoint = null;
    this.tongueLen = 0;
    this.startAngle = 0;      
    this.angleTurned = 0;     
    this.swingDir = 0;        
    this.swingSpeed = 0.05;   // 稍微再加快擺盪循環
    this.maxGrabDist = 450;   // 稍微增加射程
    this.launchBoost = 1.8;   // 保持彈射倍率
  }

  update(mapManager) {
    this.handleInput(mapManager);

    if (this.isHooked) {
      // --- 扇形擺盪階段 ---
      this.angleTurned += this.swingSpeed;
      let currentAngle = this.startAngle + (this.angleTurned * this.swingDir);

      // 更新座標
      this.pos.x = (this.hookPoint.x + this.tongueLen * Math.cos(currentAngle)) - this.width / 2;
      this.pos.y = (this.hookPoint.y + this.tongueLen * Math.sin(currentAngle)) - this.height / 2;

      // 自動完成判定
      if (this.angleTurned >= PI) {
        this.releaseHook();
      }
    } else {
      // --- 一般物理與飛行模式 ---
      this.vel.y += 0.8; 
      this.pos.y += this.vel.y;
      this.pos.x += this.vel.x;
      
      // 【修改 1】移除阻力：刪除原本的 this.vel.x *= 0.98，讓水平飛行速度完全不衰減
      // 現在你在空中會保持噴射時的速度直到撞牆或落地。

      Physics.resolveCollision(this, mapManager);
    }

    this.pos.x = constrain(this.pos.x, 0, mapManager.gridWidth - this.width);

    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = 0; 
    }

    if (this.pos.y > height && !this.isHooked) {
      this.isDead = true; 
    }
  }

  handleInput(mapManager) {
    if (!this.isHooked) {
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        this.vel.x = -this.speed;
        this.facing = 1;
      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        this.vel.x = this.speed;
        this.facing = -1;
      } else {
        // 只有站在地上時才會減速，飛行時不會受此影響
        if (this.canJump) this.vel.x *= 0.8;
      }

      if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && this.canJump) {
        this.vel.y = this.jumpForce;
        this.canJump = false;
      }
    }

    if (mouseIsPressed) {
      if (!this.isHooked) this.shootTongue(mapManager);
    } else if (this.isHooked) {
      this.releaseHook();
    }
  }

  shootTongue(mapManager) {
    let targetCamX = -this.pos.x + width / 2;
    let camX = constrain(targetCamX, -(mapManager.gridWidth - width), 0);
    let worldMouseX = mouseX - camX;
    let worldMouseY = mouseY;

    let walls = mapManager.getWalls();
    let floorY = (mapManager.data.height - 1) * mapManager.tileSize; 
    let pCenterX = this.pos.x + this.width / 2;
    let pCenterY = this.pos.y + this.height / 2;

    for (let wall of walls) {
      if (wall.y < floorY) {
        if (worldMouseX >= wall.x && worldMouseX <= wall.x + wall.w &&
            worldMouseY >= wall.y && worldMouseY <= wall.y + wall.h) {
          
          if (this.facing === -1 && (wall.x + wall.w/2) < pCenterX) continue;
          if (this.facing === 1 && (wall.x + wall.w/2) > pCenterX) continue;

          let d = dist(pCenterX, pCenterY, wall.x + wall.w/2, wall.y + wall.h/2);
          
          if (d < this.maxGrabDist) {
            this.hookPoint = createVector(wall.x + wall.w/2, wall.y + wall.h/2);
            this.isHooked = true;
            this.tongueLen = d;
            this.angleTurned = 0;
            
            this.startAngle = atan2(pCenterY - this.hookPoint.y, pCenterX - this.hookPoint.x);
            this.swingDir = (this.facing === -1) ? -1 : 1;
            break;
          }
        }
      }
    }
  }

  // 【修改 2】暴力噴射：大幅提升水平初速與向上推力
  releaseHook() {
    if (!this.isHooked) return;

    // 強大的水平噴射力 (原本 8.5 增加到 25.0)
    let launchPower = 25.0; 
    this.vel.x = (this.facing === -1 ? 1 : -1) * launchPower * this.launchBoost;

    // 同時給予明顯的向上推進，營造弧線飛行的感覺
    this.vel.y = -12; 

    this.isHooked = false;
    this.hookPoint = null;
  }

  display() {
    if (this.isHooked && this.hookPoint) {
      stroke(255, 130, 130); 
      strokeWeight(4);
      line(this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.hookPoint.x, this.hookPoint.y);
      noStroke();
    }

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