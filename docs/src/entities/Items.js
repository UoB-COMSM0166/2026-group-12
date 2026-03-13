class  Items extends Entity {
   constructor(x, y, w, h, img, element){
      super(x, y, w, h)
      this.img = img
      this.isDead = false
      this.element = element
      this.baseY = y
   }

   update(mapManager, physics){
      let floating = sin(frameCount * 0.1) * 5;
      this.pos.y = this.baseY + floating;
   }

   onCollide(player){
      player.applyTrans(this.element)
      this.isDead = true
   }

   display(){
      push()
      if (this.element === Transform.Fire){
         fill(255, 100, 100)
      }
      else if (this.element === Transform.Frozen){
         fill(100, 200, 255)
      }
      ellipse(this.pos.x + this.width / 2, this.pos.y + this.height / 2, this.width, this.height)
      pop()
   }
}