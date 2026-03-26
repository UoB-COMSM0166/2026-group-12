class Ball extends Entity{
   constructor(x, y, facing, element, img){
      super(x, y, 48, 48)
      this.element = element
      this.img = img
      this.facing = facing
      this.isDead = false

      this.ballTimer = 5
      this.ballSpeed = 15
      this.vel = createVector(this.ballSpeed * -facing, 0) 
   }

   update(physics){
      // No gravity
      this.onWallLeft = false
      this.onWallRight = false

      physics.moveX(this)
      let distance = abs(this.pos.x - this.startX)
      if (this.onWallRight || this.onWallLeft || distance > this.maxDistance){
         this.isDead = true
      }
   }

   display(){
      push();
      
      translate(this.pos.x + this.width/2, this.pos.y + this.height/2);
      scale(this.facing, 1);

      let imgToDraw = (this.element === Transform.Fire) ? fireballImg : iceballImg;
      image(imgToDraw, -this.width/2, -this.height/2, this.width * 1.3, this.height * 1.3);

      pop();
   }
}