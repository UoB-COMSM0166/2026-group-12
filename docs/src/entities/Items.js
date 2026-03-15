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
      push();

      if (this.img){
         image(this.img, this.pos.x, this.pos.y, this.width, this.height);
      }

      pop();
   }

}