class Ball extends Entity{
   constructor(x, y, facing, element, img){
      super(x, y, 48, 48)
      this.element = element
      this.img = img
      this.facing = facing
      this.isDead = false
      this.ballTimer = 60

      //
      this.ballSpeed = 8
      this.vel = createVector(this.ballSpeed * -facing, 0) 
   }

      update(physics){
         // No gravity
         this.onWallLeft = false
         this.onWallRight = false

         physics.moveX(this)
         if (this.onWallRight || this.onWallLeft || this.ballTimer < 0){
            this.isDead = true
         }
         if (this.ballTimer > 0){
            this.ballTimer--;
         } 
      }
      display(){
         push();
         if (this.element === Transform.Fire){
           fill(255, 100, 100)
         } 
         else if (this.element === Transform.Frozen){
            fill(100, 200, 255)
         }
         ellipse(this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.width, this.height);
         pop()

   }	
}