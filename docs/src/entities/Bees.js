class Bees extends Enemy {
  constructor(x, y, size, imgArray) {
    
    super(x, y, size, size, imgArray[0]); 

    
    this.frames = imgArray;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 5; // Speed of wing flapping

    //Movement Properties
    this.baseY = y;                   
    this.floatAngle = random(TWO_PI); 
    this.floatSpeed = 0.03;           
    this.floatAmplitude = 120;        

    
    this.speed = 0;
    this.vel.x = 0;

    this.hearts = (size >= 100) ? 3 : 2;
  }

  update(mapManager, physics) {
    // Check death state
    if (this.hearts <= 0) { 
      this.isDead = true; 
      return; 
    }

    // Check frozen state (stops movement if frozen by player)
    if (this.isFrozen) {
      this.frozenTimer--;
      if (this.frozenTimer <= 0) {
        this.isFrozen = false;
      }
      return; 
    }
    
  
    this.handleMovement();
  }

  display() {
    if (this.hearts <= 0) return;

    
    this.updateAnimation();

    push();
    image(this.frames[this.frameIndex], this.pos.x, this.pos.y, this.width, this.height);
    pop();
  }


  handleMovement() {
    // Vertical floating
    this.floatAngle += this.floatSpeed;
    this.pos.y = this.baseY + sin(this.floatAngle) * this.floatAmplitude; 
  }

  updateAnimation() {

    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
  }
}