class Carrot extends Entity {
  constructor(x, y, angle, img) {
    super(x, y, 60, 60);
    this.img = img;
    this.speed = 8 ;
    this.isDead = false;

   // Carrot movement
    this.vel = createVector(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

   // Rotation
    this.rotationAngle = 0;
    this.rotationSpeed = 0.3;
    //carrot life time
    this.lifeTime = 120;
  }

  update(mapManager) {

    this.lifeTime--;
    if (this.lifeTime <= 0) {
      this.isDead = true;
      return; 
    }
    
    this.rotationAngle += this.rotationSpeed;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

  // entire map
    if (this.pos.x < 0 || this.pos.x > mapManager.gridWidth || this.pos.y < 0 || this.pos.y > mapManager.gridHeight) {
      this.isDead = true;
      return;
    }
  }

  onCollide(player) {
    player.takeDamage(this.pos.x+this.width/2);
    this.isDead = true;
  }

  display() {
    push();
    translate(this.pos.x + this.width/2, this.pos.y + this.height/2);
    rotate(this.rotationAngle);
    image(this.img, - this.width/2, -this.height/2,  this.width, this.height);
    pop();
  }
}