class UIManager {
  constructor() {
    // 1. 原有的生命屬性
    this.maxHearts = 3;
    this.currentHearts = this.maxHearts;
    this.heartsSize = 30;
    this.x = 40;
    this.y = 40;
    this.gap = 35;

    // 2. 環境管理屬性
    this.gameState = "PLAYING"; 
    this.currentLevel = 1;      
    this.maxLevels = 3;         
    this.alpha = 0;             
  }

  // --- 生命值管理 ---
  loseHeart() {
    if (this.currentHearts > 0) this.currentHearts--;
  }

  addHeart() {
    if (this.currentHearts < 3) this.currentHearts++;
  }

  // --- 場景控制 ---
  levelComplete(level) {
    this.currentLevel = level;
    this.gameState = "WIN_LEVEL";
    this.alpha = 0; 
  }

  handleMousePressed() {
    if (this.gameState === "WIN_LEVEL") {
      // 偵測按鈕點擊區域
      if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
          mouseY > height / 2 + 130 && mouseY < height / 2 + 180) {
        this.goToNextLevel();
      }
    }
  }

  goToNextLevel() {
    if (this.currentLevel < this.maxLevels) {
      this.currentLevel++;
      this.gameState = "PLAYING";
      console.log("進入第 " + this.currentLevel + " 關");
    } else {
      this.gameState = "FINAL_WIN";
    }
  }

  // --- 繪製邏輯 ---
  display(heartImg) {
    if (this.gameState === "PLAYING") {
      this.drawHUD(heartImg);
    } else if (this.gameState === "WIN_LEVEL") {
      this.drawWinScreen();
    } else if (this.gameState === "FINAL_WIN") {
      this.drawFinalWin();
    }
  }

  drawHUD(heartImg) {
    for (let i = 0; i < this.maxHearts; i++) {
      if (i < this.currentHearts) {
        tint(255, 255);
      } else {
        tint(255, 50);
      }
      let xPos = this.x + (i * this.gap);
      image(heartImg, xPos, this.y, this.heartsSize, this.heartsSize);
    }
    noTint();
  }

  drawWinScreen() {
    // 背景淡入
    if (this.alpha < 255) this.alpha += 10;
    background(135, 206, 235, this.alpha); 

    // 裝飾：月亮與星星
    fill(255, 255, 150, this.alpha);
    noStroke();
    ellipse(width - 100, 80, 60, 60); 
    fill(135, 206, 235);
    ellipse(width - 80, 70, 60, 60);  

    // 文字
    textAlign(CENTER, CENTER);
    textFont('Courier New');
    textStyle(BOLD);
    fill(0, this.alpha);
    textSize(80);
    text("YOU WIN", width / 2, height / 2 - 40);

    // 繪製編號蛋 (取代外部圖片)
    this.drawPixelEgg(width / 2, height / 2 + 60, 100, this.currentLevel);

    // 按鈕
    stroke(0, this.alpha);
    strokeWeight(4);
    fill(255, this.alpha);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 155, 200, 50, 10);
    
    noStroke();
    fill(0, this.alpha);
    textSize(20);
    let btnText = this.currentLevel < this.maxLevels ? "CONTINUE" : "SEE RESULT";
    text(btnText, width / 2, height / 2 + 155);
    rectMode(CORNER);
  }

  // 內部私有繪圖方法：畫出像素風格的蛋
  drawPixelEgg(x, y, size, level) {
    push();
    translate(x, y);
    noStroke();
    
    // 根據關卡設定蛋的顏色
    let eggColors = [color(150, 255, 150), color(200, 150, 255), color(255, 150, 150)];
    fill(eggColors[level - 1]);
    ellipse(0, 0, size * 0.8, size);

    // 蛋上的裝飾點
    fill(0, 40);
    rect(-size*0.1, -size*0.2, 8, 8);
    rect(size*0.15, size*0.1, 6, 6);

    // 蛋上的白色編號
    fill(255);
    textSize(size * 0.4);
    textAlign(CENTER, CENTER);
    text(level, 0, 0);
    pop();
  }

  drawFinalWin() {
    background(255, 215, 0); // 金色背景
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(50);
    text("一家團聚！", width / 2, height / 2);
    textSize(20);
    text("你成功幫蜥蜴媽媽找回了所有蛋", width / 2, height / 2 + 60);
  }
}