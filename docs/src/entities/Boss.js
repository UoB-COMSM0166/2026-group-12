const BossState = {
  IDLE: "idle",
  CHASE: "chase",
  CLIMBUP: "climbup",
  CLIMBDOWN: "climbdown"
}
class Boss extends Enemy {
  constructor(x, y, w, h, imgArray, carrotImg) {
    //basic
    super(x, y, w, h, imgArray[0])
    this.width = w
    this.height = h

    this.frames = imgArray
    this.frameIndex = 0
    this.frameTimer = 0
    this.frameSpeed = 8

    //player detect
    this.xGap = 800
    this.yGap = 60
    
    this.facing = -1 
    this.isDead = false
    this.hearts = 20
    this.state = BossState.IDLE

    //attack
    this.attackCount = 3
    this.attackCoolTimer = 400 // minsec
    this.attackCoolPeriod = 400
    this.shootGap = 0
    //move
    this.speed = 3
    this.jumpForce = -20
    //high
    this.HighTimer = 0
    this.HighTimerTh = 45
    //carrot
    this.carrotImg = carrotImg

    }

    
    //MAIN
   

    behavior(mapManager) {

      this.playerDetect()

      this.blockAbove(mapManager)

      this.updateTimers()

      if (this.attackCoolTimer <= 0 && this.state !== BossState.IDLE) {
        this.vel.x = 0
        this.applyAttack()
      } 
      else {
        this.applyMovement()
      }

      if (this.pos.x > mapManager.gridWidth - this.width) {
        this.pos.x = mapManager.gridWidth - this.width;
      }
      
    }

    
    //TIME
    

    updateTimers() {
      if (this.attackCoolTimer >0){
        this.damageTimer--;
        this.attackCoolTimer--;
      }
    }

    //player detect
   
    // find player y ==> x
    playerDetect(){
      this.dy = player.pos.y - this.pos.y;
      this.dx = player.pos.x - this.pos.x;
      this.dist = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y);

      //higher count
      if (this.dy < -this.yGap) {
        this.HighTimer++;
      }
      else{
        this.HighTimer = 0;
      }
      // y distance first

      if ( Math.abs(this.dx) > this.xGap){
        this.state = BossState.IDLE;
      } 
      // x chase
      else if ( this.HighTimer > this.HighTimerTh){
        this.state = BossState.CLIMBUP;
      }
      else if(this.dy > this.yGap){
         this.state = BossState.CLIMBDOWN;
      }
      else {
         this.state = BossState.CHASE;
      }
      
    }

   applyMovement() {
    switch (this.state) {
      case BossState.IDLE:
        this.vel.x = 0;
        break;
      case BossState.CLIMBUP:
        this.climbUp();
        break;
      case BossState.CLIMBDOWN:
        this.climbDown();
        break;
      case BossState.CHASE:
        this.applyChase();
        break;
    }

    if(this.pos.x < 0){
      this.pos.x = 0;
    }
  }

  
  // movement
 
  blockAbove(mapManager) {
    let leftX = Math.floor((this.pos.x) / mapManager.tileSize);
    let rightX = Math.floor((this.pos.x + this.width) / mapManager.tileSize);
    let UpY = Math.floor((this.pos.y - 60) / mapManager.tileSize);

    this.aboveNoBlock = !(mapManager.isSolid(leftX, UpY) || mapManager.isSolid(rightX,  UpY));

    // find platform
    let forwardX = this.pos.x + (this.width / 2) + (this.facing * mapManager.tileSize);
    let forwardY = this.pos.y + (this.height ) - (3* mapManager.tileSize);
    let fBlockX= Math.floor(forwardX / mapManager.tileSize);
    let fBlockY = Math.floor(forwardY / mapManager.tileSize);

    this.fPlatformGet = (mapManager.isSolid(fBlockX, fBlockY)
                        && !mapManager.isSolid(fBlockX, fBlockY+1)
                        && !mapManager.isSolid(fBlockX, fBlockY-1))
                        || (mapManager.isSolid(fBlockX, fBlockY+1)
                        && !mapManager.isSolid(fBlockX, fBlockY+2)
                        && !mapManager.isSolid(fBlockX, fBlockY));
    let backX = this.pos.x + (this.width / 2) - (this.facing * mapManager.tileSize);
    let backY = this.pos.y + (this.height ) - (3* mapManager.tileSize);
    let bBlockX = Math.floor(backX / mapManager.tileSize);
    let bBlockY = Math.floor(backY / mapManager.tileSize);

    this.bPlatformGet = (mapManager.isSolid(bBlockX, bBlockY)
                        && !mapManager.isSolid(bBlockX, bBlockY+1)
                        && !mapManager.isSolid(bBlockX, bBlockY-1))
                        || (mapManager.isSolid(bBlockX, bBlockY+1)
                        && !mapManager.isSolid(bBlockX, bBlockY+2)
                        && !mapManager.isSolid(bBlockX, bBlockY));
  }

  climbUp(){
    if(this.aboveNoBlock === true){
      let playerDir = Math.sign(this.dx);
      if (playerDir !== 0 && Math.abs(this.dx) > 30){
        this.facing = playerDir;
      }
    }
    this.wallHandle();
    this.vel.x = this.facing * this.speed;
    if(this.aboveNoBlock === true && this.onGround && this.fPlatformGet){
      this.vel.y = this.jumpForce;
    }
    else if(this.aboveNoBlock === true && this.onGround && this.bPlatformGet){
      this.facing = -this.facing;
      this.vel.y = this.jumpForce;
    }
  }
  climbDown(){
      this.wallHandle();
      this.vel.x = this.facing * this.speed;
      //this.facing = -this.facing
  }
  applyChase(){
    let playerDir = Math.sign(this.dx);
      if (playerDir !== 0 && Math.abs(this.dx) > 20){
        this.facing = playerDir;
      }
      else {
        this.facing = this.facing;
      }
      this.vel.x = this.facing * this.speed;
  }
  wallHandle(){
    if (this.onWallLeft) {
      this.facing = 1;
    } else if (this.onWallRight) {
      this.facing = -1;
    }
  }


//attack


    applyAttack() {
      let playerDir = Math.sign(this.dx);
      if (playerDir !== 0 && Math.abs(this.dx) > 20) {
        this.facing = playerDir;
      }
      if(this.attackCount <= 0){
        this.attackCoolTimer = this.attackCoolPeriod;
        this.attackCount = 3;
        return;
      }
      if(this.shootGap <= 0){
        this.shootCarrot();
        this.shootGap = 60;
        this.attackCount--;
      }
      else{
        this.shootGap--;
      }
    }
    shootCarrot() {
      //boss shoot
      let shootX = this.pos.x + this.width / 2;
      let shootY = this.pos.y + this.height / 2;
      //player position
      let playerX = player.pos.x + player.width / 2;
      let playerY = player.pos.y + player.height / 2;
      //shoot angle
      let angle = Math.atan2(playerY - shootY, playerX - shootX);
      //shoot carrot
      entities.push(new Carrot(shootX, shootY, angle, this.carrotImg));

    }

    display(){
    if (this.hearts <= 0){
      return;
    }

    this.frameTimer++; 

    if(this.frameTimer >= this.frameSpeed){
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }

    
    let currentImg = this.frames[this.frameIndex]; 
    
    push();
    if (this.isFrozen){
      tint(100, 200, 255);
    } else if (this.damageTimer > 0){
      tint(255, 100, 100);
     }
    else{
      noTint();
    }

    if (this.facing === -1) {
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1); 
      image(currentImg, 0, 0, this.width, this.height);
    } else {
      // Facing right (facing === 1) 
      image(currentImg, this.pos.x, this.pos.y, this.width, this.height);
    }
    
    // Bunny's HP
    if (this.dist < 1000) {
      fill(255, 0, 0);
      rect(this.pos.x-this.width/2, this.pos.y - 20, (this.hearts / 10) * this.width, 10);
    }

    pop();
    }
  
}
