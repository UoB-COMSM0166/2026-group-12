const PlayerState = {
  IDLE: "idle",
  RUN: "run",
  JUMP: "jump",
  FALL: "fall",
  GRAPPLE: "grapple",
  STUN: "stun",
}

class Player extends Figure {
  constructor(x, y, w, h, img) {
    super(x, y, w, h);
    this.img = img;
    this.scoreValue = 0;

    // input intent
    this.inputX = 0
    this.jumpPressed = false
    this.glidePressed = false
    this.grapplePressed = false

    // ground move
    this.maxRunSpeed = 8
    this.acceleration = 0.8;
    this.friction = 0.7

    // jump
    this.jumpForce = -16;
    this.jumpCut = 0.5

    // jump system
    this.coyoteTime = 6
    this.coyoteTimer = 0

    this.jumpBufferTime = 6
    this.jumpBufferTimer = 0

    // air
    // Direction can still be adjusted in flight
    // though less effectively than on the ground.
    this.airAcceleration = 0.35
    this.airDrag = 0.98

    this.maxFallSpeed = 12

    // grapple
    //this.grapple = new GrappleSystem(this)

    /* glide
    this.isGliding = false
    this.glideFallSpeed = 3
    */
    // stun system
    this.stunMax = 10
    this.stunTimer = 0

    // State Machine
    this.state = PlayerState.IDLE; 

    this.facing = -1; // 1: Right, -1: Left
    this.isDead = false; //Dead flag
    this.hearts = 3;      // 3 Heart (chance)
  }
  //get hurt operation
  takeDamage(enemyX) {
    // when player hurt, not get hurt in short time
    if (this.state === PlayerState.STUN) return;

    //statement update
    //-heart
    this.hearts--; 
    uiManager.currentHearts = this.hearts;
    //life check
    if (this.hearts <= 0) this.isDead = true;
    this.state = PlayerState.STUN
    this.stunTimer = this.stunMax

    // beak back
    this.vel.x = this.facing * 5
    this.vel.y = -3
  }

  update(mapManager, physics) {
    if(this.pos.y > mapManager.gridHeight){
      this.isDead = true;
    }
    this.handleInput();

    this.updateTimers();

    this.updateState();

    this.applyMovement();

  physics.update(this)
  // Map boundary constraints
  this.pos.x = constrain(this.pos.x, 0, mapManager.gridWidth - this.width);

  }

  handleInput() {
    this.inputX = 0

    // TO BE IMPLEMENTED
    // A
    if (keyIsDown(65)) {
      this.inputX -= 1
      this.facing = 1
    }

    // D
    if (keyIsDown(68)) {
      this.inputX += 1
      this.facing = -1
    }

    this.jumpPressed = keyIsDown(87) // W
    this.grapplePressed = mouseIsPressed // LEFT_PRESSED

  }

  // STATE MACHINE
  updateState() {
    switch (this.state) {

      case PlayerState.IDLE:

      case PlayerState.RUN:
        this.updateGroundState()
        break

      case PlayerState.JUMP:
        this.updateJumpState()
        break

      case PlayerState.FALL:
        this.updateFallState()
        break

      case PlayerState.GRAPPLE:
        this.updateGrappleState()
        break
      
      case PlayerState.STUN:
        this.updateStunState()
        break
    }
  }

  updateGroundState() {
    this.tryJump()

    if (!this.onGround) {
      this.state = PlayerState.FALL
      return
    }

    if (this.inputX === 0) {
      this.state = PlayerState.IDLE
    }
    else {
      this.state = PlayerState.RUN
    }

    if (this.grapplePressed) {
      this.startGrapple()
    }

  }

  updateJumpState() {
    if (this.vel.y > 0) {
      this.state = PlayerState.FALL
    }

    if (this.grapplePressed) {
      this.startGrapple()
    }

  }

  updateFallState() {
    this.tryJump()

    if (this.onGround) {
      this.state = PlayerState.RUN
      return
    }
  }

  updateStunState() {
    if(this.stunTimer<=0){
      if (this.onGround) {
        this.state = PlayerState.IDLE
      } else {
        this.state = PlayerState.FALL
      }
    }
  }
    /*
    if (this.grapplePressed) {
      this.startGrapple()
    }

  }

  updateGrappleState() {
    if (!this.grapplePressed) {
      this.releaseGrapple()
      this.state = PlayerState.FALL
      return
    }*/

  

  applyMovement() {

    switch (this.state) {

      case PlayerState.IDLE:

      case PlayerState.RUN:
        this.applyGroundMovement()
        break

      case PlayerState.JUMP:

      case PlayerState.FALL:
        this.applyAirMovement()
        break

      case PlayerState.STUN:
        this.applyStunMovement(); 
        break;
    }

  }

  applyGroundMovement() {
    this.vel.x += this.inputX * this.acceleration

    this.vel.x = constrain(this.vel.x, -this.maxRunSpeed, this.maxRunSpeed)

    if (this.inputX === 0) {
      this.vel.x *= this.friction
    }

  }

  applyAirMovement() {
    this.vel.x += this.inputX * this.airAcceleration

    this.vel.x *= this.airDrag

  }
  applyStunMovement(){
    if(this.onGround){
      this.vel.x *= this.friction
    } else {
      this.vel.x *= this.airDrag
    }
  }

  tryJump() {
    if (this.jumpBufferTimer > 0 && this.coyoteTimer > 0) {
      this.vel.y = this.jumpForce

      this.jumpBufferTimer = 0
      this.coyoteTimer = 0

      this.state = PlayerState.JUMP
    }

  }

  // Allow Player to jump for several frames after leaving the platform.
  updateTimers() {
    // coyote time
    if (this.onGround) {
      this.coyoteTimer = this.coyoteTime
    }
    else if (this.coyoteTimer > 0) {
      this.coyoteTimer--
    }

    // jump buffer
    if (this.jumpPressed) {
      this.jumpBufferTimer = this.jumpBufferTime
    }
    else if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer--
    }

    // stun timer
    if (this.stunTimer > 0) {
      this.stunTimer--
    }

  }
  display() {
    // === TO BE UPDATED
    
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


