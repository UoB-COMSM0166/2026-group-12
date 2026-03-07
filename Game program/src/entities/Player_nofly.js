class Player extends GameObject {
  constructor(x, y, w, h, img) {
    super(x, y);
    this.img = img;
    this.width = w;
    this.height = h;

    //移動能力---
    this.speed = 5;
    this.jumpForce = -25;

    //設定初始狀態---
    this.state = 'IDLE'; //閒置。
    this.facing = 1; // 1: Left, -1: Right
    this.isDead = false;//生命的flag
    this.hearts = 3;      // 總共 3 顆愛心
    this.canJump = false;
    this.isHurt = false;       // 是否處於受傷動作鎖定狀態
    this.isInvincible = false; // 硬直的flag
    this.invincibilityTimer = 0; // 受傷後的硬直幀，避免短時間持續扣血

    // 攻擊定義區 ---
    this.isAttacking = false;
    this.attackTimer = 0;
    this.attackRange = 200; // 舌頭攻擊距離

    // 扇形擺盪定義區 ---
    this.isHooked = false;
    this.hookPoint = null;
    this.tongueLen = 0;
    this.startAngle = 0;      // 勾住瞬間的角度
    this.angleTurned = 0;     // 已經旋轉了多少弧度 (0 ~ PI)
    this.swingDir = 0;        // 旋轉方向 (1 或 -1)
    this.swingSpeed = 0.04;   // 擺盪速度 (數值越小越慢)
    this.maxGrabDist = 700;   // 最大射程
  }
  //人物受傷定義---
  takeDamage(enemyX) {
    // 擺盪和硬直期間扣愛心
    if (this.isInvincible) return;
    //扣血+硬直
    this.hearts--;
    this.invincibilityTimer = 10; 

    //往後擊飛
    this.vel.x = this.facing * 20; 
    this.vel.y = -3;

    if (this.hearts <= 0) this.isDead = true;
  }

  update(mapManager, entities) {
  //--生存狀態更新--
  // A. 低於地面即死，擺盪期間不算 
  if (this.pos.y > height && !this.isHooked) {
    this.isDead = true; 
  }
    
  // B. 硬直與狀態更新
  if (this.invincibilityTimer > 0) this.invincibilityTimer--;
  this.isInvincible = (this.isHooked || this.invincibilityTimer > 0);
  
  // C. 攻擊計時--
  if (this.attackTimer > 0) {
    this.attackTimer--;
    // 偵測攻擊
    this.checkAttack(entities); 
  } else {
    this.isAttacking = false;
  }

  // D. 處理輸入與物理
    this.handleInput(mapManager);
    // --- 扇形擺盪 ---
    if (this.isHooked) {
      // 1. 累加旋轉進度 (最大 PI，即 180 度)
      this.angleTurned += this.swingSpeed;

      // 2. 計算當前角度 (從起點開始往面向的方向轉)
      let currentAngle = this.startAngle + (this.angleTurned * this.swingDir);

      // 3. 更新位置 (以 hookPoint 中心為準)
      this.pos.x = (this.hookPoint.x + this.tongueLen * Math.cos(currentAngle)) - this.width / 2;
      this.pos.y = (this.hookPoint.y + this.tongueLen * Math.sin(currentAngle)) - this.height / 2;

      // 4. 自動結束判定 (轉滿 180 度則放手)
      if (this.angleTurned >= PI) {
        this.releaseHook();
      }
    } else {
      // --- 一般物理模式 ---
      this.vel.y += 0.8; // 重力
      this.pos.y += this.vel.y;
      this.pos.x += this.vel.x;
      
      // 慣性衰減
      this.vel.x *= 0.95;

      // 地面碰撞偵測
      Physics.resolveCollision(this, mapManager);
    }

    // 地圖邊界限制
    this.pos.x = constrain(this.pos.x, 0, mapManager.gridWidth - this.width);
  }
  //輸入處理---
  handleInput(mapManager) {

    // 左鍵擺盪
    if (mouseIsPressed && mouseButton === LEFT) {
      if (!this.isHooked) this.shootTongue(mapManager);
    } else if (this.isHooked) {
      this.releaseHook();
    }

    // 右鍵攻擊
    if (mouseIsPressed && mouseButton === RIGHT && !this.isAttacking) {
      this.isAttacking = true;
      this.attackTimer = 2; // 攻擊判定持續時間(ms)
    }
    //左右移動(左,右 || A,D)
    if (!this.isHooked && this.invincibilityTimer === 0) {
      if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        this.vel.x = -this.speed;
        this.facing = 1;
      } else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        this.vel.x = this.speed;
        this.facing = -1;
      } else {
        this.vel.x = 0;
      }
    // 跳
      if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && this.canJump) {
        this.vel.y = this.jumpForce;
        this.canJump = false;
      }
    }
  }
  // 攻擊範圍偵測---
checkAttack(entities) {
  for (let e of entities) {
    if (e instanceof Enemy && !e.isDead) {
      let dx = (e.pos.x + e.width / 2) - (this.pos.x + this.width / 2);
      let dy = Math.abs((e.pos.y + e.height / 2) - (this.pos.y + this.height / 2));
      
      // 判定敵人在前方且在舌頭長度與高度誤差內
      let isFacing = (this.facing === -1 && dx > 0) || (this.facing === 1 && dx < 0);
      if (isFacing && Math.abs(dx) < this.attackRange && dy < 40) {
        e.hearts--; // 扣除敵人愛心
      }
    }
  }
}
//點擊觸發擺盪
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
      // 限制 1：僅限懸空方塊
      if (wall.y < floorY) {
        // 限制 2：點擊方塊 60x60 範圍
        if (worldMouseX >= wall.x && worldMouseX <= wall.x + wall.w &&
            worldMouseY >= wall.y && worldMouseY <= wall.y + wall.h) {
          
          // 限制 3：禁止朝後方發射 (根據 facing 判斷)
          if (this.facing === -1 && (wall.x + wall.w/2) < pCenterX) continue;
          if (this.facing === 1 && (wall.x + wall.w/2) > pCenterX) continue;

          let d = dist(pCenterX, pCenterY, wall.x + wall.w/2, wall.y + wall.h/2);
          
          if (d < this.maxGrabDist) {
            //吸附方塊中心點
            this.hookPoint = createVector(wall.x + wall.w/2, wall.y + wall.h/2);
            this.isHooked = true;
            this.tongueLen = d;
            this.angleTurned = 0;
            
            // 計算初始角度
            this.startAngle = atan2(pCenterY - this.hookPoint.y, pCenterX - this.hookPoint.x);
            
            // 決定旋轉方向 (1 順時針, -1 逆時針)
            // 如果面向右 (-1)，且人在下方，通常要減少角度才能往右甩
            // 這裡簡化邏輯：面向右則 swingDir = -1，面向左則 swingDir = 1
            this.swingDir = (this.facing === -1) ? -1 : 1;
            break;
          }
        }
      }
    }
  }

  // 釋放鉤子並給予慣性
  releaseHook() {
    if (!this.isHooked) return;
    
    // 給予固定的噴射慣性 (面向哪就噴向哪)
    this.vel.x = (this.facing === -1) ? 12 : -12;
    this.vel.y = -10; // 稍微往上噴一點
    
    this.isHooked = false;
    this.hookPoint = null;
  }

  display() {
    // 繪製攻擊效果---
    // 舌頭攻擊
    if (this.isAttacking) {
      stroke(255, 50, 50);
      strokeWeight(6);
      let atkEndX = (this.facing === -1) ? (this.pos.x + this.width + this.attackRange) : (this.pos.x - this.attackRange);
      line(this.pos.x + this.width / 2, this.pos.y + this.height / 2, atkEndX, this.pos.y + this.height / 2);
      noStroke();
    }

    // 繪製擺盪效果---
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