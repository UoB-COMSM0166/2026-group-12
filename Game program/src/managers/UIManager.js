class UIManager {
  
  constructor(){
    this.maxHearts = 3;
    this.currentHearts = this.maxHearts;
    this.heartsSize = 30;
    this.x = 40;
    this.y = 40;
    this.gap = 35;
  }

  loseHeart() {
    if (this.currentHearts > 0) this.currentHearts--;
  }

  addHeart() {
    if (this.currentHearts < 3) this.currentHearts++;
  }

  display(heartImg){
    for (let i = 0; i < this.maxHearts; i++){
      if (i < this.currentHearts){
        tint(255, 255); 
      } else{
        tint(255, 50);
      }

      let xPos = this.x + (i * this.gap);
      image(heartImg, xPos, this.y, this.heartsSize, this.heartsSize);
    }
    noTint();
  }

}