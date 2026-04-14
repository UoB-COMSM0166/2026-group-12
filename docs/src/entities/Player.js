const PlayerState = {
  IDLE: "idle",
  RUN: "run",
  JUMP: "jump",
  FALL: "fall",
  GRAPPLE: "grapple",
  STUN: "stun",
}
const Transform = {
  No: "no",
  Fire: "fire",
  Frozen: "frozen",
}

class Player extends Figure {
  constructor(x, y, w, h, imgs){
    super(x, y, w, h);
    this.imgs = imgs;

    this.width = w;
    this.height = h;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.scoreValue = 0;

    // input intent
    this.inputX = 0;
    this.jumpPressed = false;
    this.glidePressed = false;
    this.grapplePressed = false;

    // ground move
    this.maxRunSpeed = 10;
    this.acceleration = 0.8;
    this.friction = 0.6;

    // jump
    this.jumpForce = -20; //-16
    this.jumpCut = 0.5;

    // jump system
    this.coyoteTime = 6;
    this.coyoteTimer = 0;

    this.jumpBufferTime = 6;
    this.jumpBufferTimer = 0;

    this.jumpAnimDone = false;

    // air
    // Direction can still be adjusted in flight
    // though less effectively than on the ground.
    this.airAcceleration = 0.35;
    this.airDrag = 0.98;

    this.maxFallSpeed = 12;

    // grapple
    this.grapple = new GrappleAbility(this);
    this.grapBufferTime = 6;
    this.grapBufferTimer = 0;

    /* glide
    this.isGliding = false
    this.glideFallSpeed = 3
    */
    // stun system
    this.stunMax = 40;
    this.stunTimer = 0;

    // State Machine
    this.state = PlayerState.IDLE;
    // Player Transform
    this.trans = Transform.No
    this.transTime = 600
    this.transTimer = 600
    this.attackCooldown = 0

    this.facing = 1
    this.isDead = false // Dead flag
    this.hearts = 5    // 5 Heart (chance)
    this.keyPopups = [];

    this.damageTimer = 0;
    this.damageCooldown = 10;
  }

  handleInput(){
    this.inputX = 0;

    // A
    if (keyIsDown(65)){
      this.inputX -= 1;
      this.facing = -1;
    }

    // D
    if (keyIsDown(68)){
      this.inputX += 1;
      this.facing = 1;
    }

    this.jumpPressed = keyIsDown(87); // W
  }
  
  // get hurt operation
  takeDamage(enemyX){
    // when player hurt, not get hurt in short time
    if (this.state === PlayerState.STUN) {
      return;
    }

    // -heart
    this.hearts--;
    sfx.hurt.play();
    this.damageTimer = this.damageCooldown;
    uiManager.currentHearts = this.hearts;
    //life check
    if (this.hearts <= 0){
      this.isDead = true;
      this.vel.x = 0;
      this.vel.y = -10;
    }

    this.state = PlayerState.STUN;
    this.stunTimer = this.stunMax;

    // knock back
    this.vel.x = this.facing * -12;
    this.vel.y = -10;
  }
  // transform apply
  applyTrans(formChange){
    sfx.transform.play();
    this.trans = formChange;
    this.transTimer = this.transTime;
  }
  //apply attack
  applyAttack(){
    if (this.attackCooldown > 0) {
      return;
    }

    this.attackCooldown = 15;

      let shootX;
      if (this.facing === 1){
        shootX = this.pos.x + 65;
      }
      else{
        shootX = this.pos.x + this.width - 65;
      }

    let shootY = this.pos.y + (this.height / 2) - 30;

    let img;

    if (this.trans === Transform.Fire){
      this.jumpForce = -20;
      img = fireballImg;
    }
    else if (this.trans === Transform.Frozen){
      img = iceballImg;
    }

    let newBall = new Ball(shootX, shootY, this.facing, this.trans, img);
    sfx.shoot.play();

    ball.push(newBall);
  }


  update(mapManager, physics){
    if (this.pos.y > mapManager.gridHeight){
      this.isDead = true;
    }
    this.handleInput();

    this.updateTimers();

    this.updateState();

    this.updateKeyPopups();

    this.applyMovement();

    if (this.attackCooldown > 0){
      this.attackCooldown--;
    }
    if (this.attackPressed && (this.trans === Transform.Fire || this.trans === Transform.Frozen)){
       this.applyAttack();
       this.attackPressed = false;
    }

    physics.update(this);

    // Map boundary constraints
    this.pos.x = constrain(this.pos.x, 0, mapManager.gridWidth - this.width);

    if (this.grapple) {
      if (this.grapplePressed && !this.grapple.active) {
        let worldX = mouseX - camX;
        let worldY = mouseY - camY;

        let success = this.grapple.shoot(worldX, worldY)
        if (success) this.setState(PlayerState.GRAPPLE);
      }

      if (!this.grapplePressed && this.grapple.active) {
        this.grapple.release();
        if (this.state === PlayerState.GRAPPLE) {
          this.setState(PlayerState.FALL);
        }
      }

      this.grapple.update();
    }
  }

  // STATE MACHINE
  updateState(){

    switch (this.state){

      case PlayerState.IDLE:
      case PlayerState.RUN:
        this.updateGroundState();
        break;

      case PlayerState.JUMP:
        this.updateJumpState();
        break;

      case PlayerState.FALL:
        this.updateFallState();
        break;

      case PlayerState.GRAPPLE:
        this.updateGrappleState();
        break;
      
      case PlayerState.STUN:
        this.updateStunState();
        break;
    }
  }


  setState(newState){
    if (this.state !== newState) {
      this.imgs[newState]?.reset();
      this.state = newState;
    }
  }

  updateGroundState(){
    this.tryJump();

    if (!this.onGround){
      this.setState(PlayerState.FALL);
      return;
    }

    if (this.inputX === 0){
      this.setState(PlayerState.IDLE);
    }
    else{
      this.setState(PlayerState.RUN);
    }

    if (this.grapplePressed){
      this.startGrapple();
      this.grapplePressed = false;
    }
  }

  updateJumpState(){
    if (this.vel.y > 0){
      this.setState(PlayerState.FALL);
    }

    if (this.grapplePressed){
      this.startGrapple();
      this.grapplePressed = false;
    }
  }

  updateFallState(){
    this.tryJump();

    if (this.onGround){
      sfx.land.play();
      this.jumpAnimDone = false;
      this.setState(this.inputX === 0 ? PlayerState.IDLE : PlayerState.RUN);
      return;
    }
  }

  updateStunState() {
    if(this.stunTimer <= 0){
      if (this.onGround) {
        this.setState(PlayerState.IDLE);
      } 
      else{
        this.setState(PlayerState.FALL);
      }
    }
  
    
    if(this.grapplePressed){
      this.startGrapple();
      this.grapplePressed = false;
    }
  }

  updateGrappleState(){
    if (!this.grapplePressed){
      this.grapple.release();
      this.setState(PlayerState.FALL);
      return;
    }
  }

  onMousePressed(btn) {
    if (btn === LEFT) {
      this.grapplePressed = true;
    }
    if (btn === RIGHT) {
      this.attackPressed = true;
    }
  }

  onMouseReleased(btn) {
    if (btn === LEFT) {
      this.grapplePressed = false;
    }

    if (btn === RIGHT) {
      this.attackPressed = false;
    }
  }


  startGrapple() {
    if (!this.grapple) return;
    if (this.grapple.active || this.grapple.tongueFlying) return;

    this.vel.x = 0;
    this.vel.y = 0;

    let worldX = mouseX - camX;
    let worldY = mouseY - camY;

    let success = this.grapple.shoot(worldX, worldY);
    if (success) {
      this.setState(PlayerState.GRAPPLE);
    }
  }

  applyMovement(){

    switch (this.state){

      case PlayerState.IDLE:
      case PlayerState.RUN:
        this.applyGroundMovement();
        break;

      case PlayerState.JUMP:
      case PlayerState.FALL:
        this.applyAirMovement();
        break;

      case PlayerState.STUN:
        this.applyStunMovement();
        break;
    }
  }

  applyGroundMovement(){
    this.vel.x += this.inputX * this.acceleration;
    this.vel.x = constrain(this.vel.x, -this.maxRunSpeed, this.maxRunSpeed);

    if (this.inputX === 0){
      this.vel.x *= this.friction;
    }
  }

  applyAirMovement(){
    this.vel.x += this.inputX * this.airAcceleration;
    this.vel.x *= this.airDrag;
  }

  applyStunMovement(){
    if(this.onGround){
      this.vel.x *= this.friction;
    } 
    else{
      this.vel.x *= this.airDrag;
    }
  }

  tryJump(){
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0){
      this.vel.y = this.jumpForce;
      sfx.jump.play();
      this.jumpBufferTimer = 0;
      this.coyoteTimer = 0;
      this.setState(PlayerState.JUMP);
      this.jumpAnimDone = false;
    }
  }

  onJumpPressed() {
    this.jumpBufferTimer = this.jumpBufferTime;
  }

  // Allow Player to jump for several frames after leaving the platform.
  updateTimers(){
    // coyote time
    if (this.onGround){
      this.coyoteTimer = this.coyoteTime;
      this.hasJumped = false;
    }
    else if (this.coyoteTimer > 0){
      this.coyoteTimer--;
    }

    // jump buffer
    if (this.jumpBufferTimer > 0){
      this.jumpBufferTimer--;
    }

    // stun timer
    if (this.stunTimer > 0){
      this.stunTimer--;
    }

    // transform timer
    if (this.trans !== Transform.No){
      if (this.transTimer > 0){
        this.transTimer--;
      }
      else{
        this.trans = Transform.No;
      }
    }

    this.damageTimer--;
  }

  showKeyPopup() {
    this.keyPopups.push({
      x: this.pos.x + this.width / 2,
      y: this.pos.y,
      alpha: 255,
      offsetY: 0
    });
  }

  updateKeyPopups() {
    for (let i = this.keyPopups.length - 1; i >= 0; i--) {
      let k = this.keyPopups[i];
      k.offsetY -= 1.5;
      k.alpha -= 4;
      if (k.alpha <= 0) {
        this.keyPopups.splice(i, 1);
      }
    }
  }

  displayKeyPopups(keyImg) {
  for (let k of this.keyPopups) {
    tint(255, k.alpha);
    image(keyImg, k.x - 20, k.y + k.offsetY, 40, 40);
    noTint();
  }
}

  
  display(){
    let currentImg
    switch (this.state) {
      case PlayerState.IDLE: currentImg = this.imgs.idle; break;
      case PlayerState.RUN: currentImg = this.imgs.run;  break;
      case PlayerState.FALL: currentImg = this.imgs.jumping; break;
      case PlayerState.GRAPPLE: currentImg = this.imgs.jumping; break;
      case PlayerState.JUMP:
        if (!this.jumpAnimDone) {
          if (this.imgs.jump.getCurrentFrame() === this.imgs.jump.numFrames() - 1) {
            this.jumpAnimDone = true
          }
          currentImg = this.imgs.jump
        } else {
          currentImg = this.imgs.jumpLoop
        }
        break;
      default: currentImg = this.imgs.idle
    }

    push()
    // transform
    if (this.trans === Transform.Fire){
      tint(255, 100, 100);
    } 
    else if (this.trans === Transform.Frozen){
      tint(100, 180, 255);
    }
    else{
      noTint();
    }

    if (this.damageTimer > 0){
      tint(255, 0, 0);
    } 

    if (this.facing === -1){
      translate(this.pos.x + this.width, this.pos.y);
      scale(-1, 1);
      image(currentImg, 0, 0, this.width, this.height);
    } 
    else{
      image(currentImg, this.pos.x, this.pos.y, this.width, this.height);
    }
    pop();

    this.displayKeyPopups(keyImg);
    this.grapple.display();
  }
}