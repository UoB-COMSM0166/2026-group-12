class Bees extends Enemy {
  constructor(x, y, size, imgArray) {
    // Initialize parent class (Enemy)
    super(x, y, size, size, imgArray[0]); 

    // --- Animation Properties ---
    this.frames = imgArray;
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameSpeed = 5; // Speed of wing flapping

    // --- Movement Properties ---
    this.baseY = y;                   // Center point for vertical floating
    this.floatAngle = random(TWO_PI); // Random starting phase to make each bee unique
    this.floatSpeed = 0.03;           // Vertical movement speed
    this.floatAmplitude = 120;        // Vertical movement range (height)

    // Disable horizontal movement inherited from Enemy.js
    this.speed = 0;
    this.vel.x = 0;

    // --- Enemy Stats ---
    // Set health based on the size of the bee
    this.hearts = (size >= 100) ? 3 : 2;
  }

  update(mapManager, physics) {
    // 1. Check death state
    if (this.hearts <= 0) { 
      this.isDead = true; 
      return; 
    }

    // 2. Check frozen state (stops movement if frozen by player)
    if (this.isFrozen) {
      this.frozenTimer--;
      if (this.frozenTimer <= 0) {
        this.isFrozen = false;
      }
      return; 
    }
    
    // 3. Apply movement
    this.handleMovement();
  }

  display() {
    if (this.hearts <= 0) return;

    // Process frame changes for the flapping animation
    this.updateAnimation();

    push();
    // Bees only fly vertically, so no horizontal flipping (scale(-1, 1)) is needed
    image(this.frames[this.frameIndex], this.pos.x, this.pos.y, this.width, this.height);
    pop();
  }

  // --- Helper Methods ---

  handleMovement() {
    // Apply sine wave formula for smooth vertical floating
    this.floatAngle += this.floatSpeed;
    this.pos.y = this.baseY + sin(this.floatAngle) * this.floatAmplitude; 
  }

  updateAnimation() {
    // Cycle through the sprite frames based on frameSpeed
    this.frameTimer++;
    if (this.frameTimer >= this.frameSpeed) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
    }
  }
}