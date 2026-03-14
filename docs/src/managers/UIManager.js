class UIManager {
  constructor() {
    this.maxHearts = 3;
    this.currentHearts = this.maxHearts;
    this.heartsSize = 40;
    this.maxKeys = 3;
    this.currentKeys = 0;
    this.keySize = 40;
    this.x = 40;
    this.y = 40;
    this.gap = 45;

    this.titleY = 0;
    this.titleTargetY = 300;
    this.btnScale = 1;
    this.keyButtons = {};

    // // 2. 環境管理屬性
    // this.gameState = "PLAYING"; 
    // this.currentLevel = 1;
    // this.maxLevels = 3;
    // this.alpha = 0;
  }

  getScaledHeight(img, targetW) {
    return img.height * (targetW / img.width);
  }

  displayStart(titleImg, startBtnImg, tutorialBtnImg) {

    background(173, 228, 249);
    this.titleY = lerp(this.titleY, this.titleTargetY, 0.05);
    let titleW = 800;
    let titleH = this.getScaledHeight(titleImg, titleW);
    image(titleImg, width / 2 - titleW / 2, this.titleY, titleW, titleH);

    let btnW = 300;
    let gap = 80;

    this.startBtnW = btnW;
    this.startBtnH = this.getScaledHeight(startBtnImg, btnW);
    this.startBtnX = width / 2 - btnW - gap / 2;
    this.startBtnY = height / 2 + 100;
    image(startBtnImg, this.startBtnX, this.startBtnY, this.startBtnW, this.startBtnH);


    this.tutorialBtnW = btnW;
    this.tutorialBtnH = this.getScaledHeight(tutorialBtnImg, btnW);
    this.tutorialBtnX = width / 2 + gap / 2;
    this.tutorialBtnY = height / 2 + 100;
    image(tutorialBtnImg, this.tutorialBtnX, this.tutorialBtnY, this.tutorialBtnW, this.tutorialBtnH);
  }

  isStartButtonClicked(mx, my) {
    return mx > this.startBtnX && mx < this.startBtnX + this.startBtnW &&
          my > this.startBtnY && my < this.startBtnY + this.startBtnH;
  }

  isTutorialButtonClicked(mx, my) {
    return mx > this.tutorialBtnX && mx < this.tutorialBtnX + this.tutorialBtnW &&
          my > this.tutorialBtnY && my < this.tutorialBtnY + this.tutorialBtnH;
  }

  displayLevel(levelTextImg, levelBtnImgs, saveManager){
    background(173, 228, 249);

    let textW = 1000;
    let textH = this.getScaledHeight(levelTextImg, textW);
    image(levelTextImg, width / 2 - textW / 2, 300, textW, textH);

    let levelBtnW = 180;
    let levelBtnH = this.getScaledHeight(levelBtnImgs[0], levelBtnW);
    let gap = 100;
    let totalW = levelBtnImgs.length * (levelBtnW + gap) - gap;
    let startX = width / 2 - totalW / 2;
    let levelBtnY = 500;

    // store level button positions
    this.levelBtns = [];

    for (let i = 0; i < levelBtnImgs.length; i++) {
      let x = startX + i * (levelBtnW + gap);
      let unlocked = saveManager.isUnlocked(i + 1);

      if (unlocked) {
        tint(255, 255);
      } else {
        tint(100, 100);
      }

      image(levelBtnImgs[i], x, levelBtnY, levelBtnW, levelBtnH);

      this.levelBtns.push({ x, y: levelBtnY, w: levelBtnW, h: levelBtnH, unlocked });
    }

    noTint();

  }

  getLevelClicked(mx, my) {
    if (!this.levelBtns) return -1;
    for (let i = 0; i < this.levelBtns.length; i++) {
      let b = this.levelBtns[i];
      if (b.unlocked &&
          mx > b.x && mx < b.x + b.w &&
          my > b.y && my < b.y + b.h) {
        return i + 1; 
      }
    }
    return -1;
  }

  displayGameOver(gameOverTextImg, restartBtnImg, homeBtnImg) {
    background(173, 228, 249);
    let gameOverTextW = 1200;
    let gameOverTextH = this.getScaledHeight(gameOverTextImg, gameOverTextW);
    image(gameOverTextImg, width / 2 - gameOverTextW / 2, 300, gameOverTextW, gameOverTextH);

    let btnW = 300;
    let gap = 80;

    this.restartBtnW = btnW;
    this.restartBtnH = this.getScaledHeight(restartBtnImg, btnW);
    this.restartBtnX = width / 2 - btnW - gap / 2;
    this.restartBtnY = height / 2 + 30;
    image(restartBtnImg, this.restartBtnX, this.restartBtnY, this.restartBtnW, this.restartBtnH);

    this.homeBtnW = btnW;
    this.homeBtnH = this.getScaledHeight(homeBtnImg, btnW);
    this.homeBtnX = width / 2 + gap / 2;
    this.homeBtnY = height / 2 + 30;
    image(homeBtnImg, this.homeBtnX, this.homeBtnY, this.homeBtnW, this.homeBtnH);
  }

  isRestartButtonClicked(mx, my) {
    return mx > this.restartBtnX && mx < this.restartBtnX + this.restartBtnW &&
          my > this.restartBtnY && my < this.restartBtnY + this.restartBtnH;
  }

  isHomeButtonClicked(mx, my) {
    return mx > this.homeBtnX && mx < this.homeBtnX + this.homeBtnW &&
          my > this.homeBtnY && my < this.homeBtnY + this.homeBtnH;
  }

  displayGameWin(gameWinTextImg, homeBtnImg) {
    background(173, 228, 249);
    let gameWinTextW = 1200;
    let gameWinTextH = this.getScaledHeight(gameWinTextImg, gameWinTextW);
    image(gameWinTextImg, width / 2 - gameWinTextW / 2, 300, gameWinTextW, gameWinTextH);

    this.homeBtnW = 400;
    this.homeBtnH = this.getScaledHeight(homeBtnImg, this.homeBtnW);
    this.homeBtnX = width / 2 - this.homeBtnW / 2;
    this.homeBtnY = height / 2 + 30;
    image(homeBtnImg, this.homeBtnX, this.homeBtnY, this.homeBtnW, this.homeBtnH);
  }


  loseHeart() {
    if (this.currentHearts > 0) this.currentHearts--;
  }

  addHeart() {
    if (this.currentHearts < 3) this.currentHearts++;
  }

  addKey() {
    if (this.currentKeys < 3) this.currentKeys++;
  }

  display(heartImg, keyImg){
    for (let i = 0; i < this.maxHearts; i++){
      if (i < this.currentHearts){
        tint(255, 255); 
      } else{
        tint(255, 50);
      }
      let xPos = this.x + (i * this.gap);
      image(heartImg, xPos, this.y, this.heartsSize, this.heartsSize);
    }

    for (let i = 0; i < this.maxKeys; i++) {
      if (i < this.currentKeys) {
        tint(255, 255);
      } else {
        tint(255, 50);
      }
      let keyX = width - this.x - (i + 1) * this.gap;
      image(keyImg, keyX, this.y, this.keySize, this.keySize);
    }
    noTint();
  }



  // // --- 場景控制 ---
  // levelComplete(level) {
  //   this.currentLevel = level;
  //   this.gameState = "WIN_LEVEL";
  //   this.alpha = 0; 
  // }

  // handleMousePressed() {
  //   if (this.gameState === "WIN_LEVEL") {
  //     // 偵測按鈕點擊區域
  //     if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 &&
  //         mouseY > height / 2 + 130 && mouseY < height / 2 + 180) {
  //       this.goToNextLevel();
  //     }
  //   }
  // }

  // goToNextLevel() {
  //   if (this.currentLevel < this.maxLevels) {
  //     this.currentLevel++;
  //     this.gameState = "PLAYING";
  //     console.log("進入第 " + this.currentLevel + " 關");
  //   } else {
  //     this.gameState = "FINAL_WIN";
  //   }
  // }

  // // --- 繪製邏輯 ---
  // display(heartImg) {
  //   if (this.gameState === "PLAYING") {
  //     this.drawHUD(heartImg);
  //   } else if (this.gameState === "WIN_LEVEL") {
  //     this.drawWinScreen();
  //   } else if (this.gameState === "FINAL_WIN") {
  //     this.drawFinalWin();
  //   }
  // }

  // drawHUD(heartImg) {
  //   for (let i = 0; i < this.maxHearts; i++) {
  //     if (i < this.currentHearts) {
  //       tint(255, 255);
  //     } else {
  //       tint(255, 50);
  //     }
  //     let xPos = this.x + (i * this.gap);
  //     image(heartImg, xPos, this.y, this.heartsSize, this.heartsSize);
  //   }
  //   noTint();
  // }

  // drawWinScreen() {
  //   // 背景淡入
  //   if (this.alpha < 255) this.alpha += 10;
  //   background(135, 206, 235, this.alpha); 

  //   // 裝飾：月亮與星星
  //   fill(255, 255, 150, this.alpha);
  //   noStroke();
  //   ellipse(width - 100, 80, 60, 60); 
  //   fill(135, 206, 235);
  //   ellipse(width - 80, 70, 60, 60);  

  //   // 文字
  //   textAlign(CENTER, CENTER);
  //   textFont('Courier New');
  //   textStyle(BOLD);
  //   fill(0, this.alpha);
  //   textSize(80);
  //   text("YOU WIN", width / 2, height / 2 - 40);

  //   // 繪製編號蛋 (取代外部圖片)
  //   this.drawPixelEgg(width / 2, height / 2 + 60, 100, this.currentLevel);

  //   // 按鈕
  //   stroke(0, this.alpha);
  //   strokeWeight(4);
  //   fill(255, this.alpha);
  //   rectMode(CENTER);
  //   rect(width / 2, height / 2 + 155, 200, 50, 10);
    
  //   noStroke();
  //   fill(0, this.alpha);
  //   textSize(20);
  //   let btnText = this.currentLevel < this.maxLevels ? "CONTINUE" : "SEE RESULT";
  //   text(btnText, width / 2, height / 2 + 155);
  //   rectMode(CORNER);
  // }

  // // 內部私有繪圖方法：畫出像素風格的蛋
  // drawPixelEgg(x, y, size, level) {
  //   push();
  //   translate(x, y);
  //   noStroke();
    
  //   // 根據關卡設定蛋的顏色
  //   let eggColors = [color(150, 255, 150), color(200, 150, 255), color(255, 150, 150)];
  //   fill(eggColors[level - 1]);
  //   ellipse(0, 0, size * 0.8, size);

  //   // 蛋上的裝飾點
  //   fill(0, 40);
  //   rect(-size*0.1, -size*0.2, 8, 8);
  //   rect(size*0.15, size*0.1, 6, 6);

  //   // 蛋上的白色編號
  //   fill(255);
  //   textSize(size * 0.4);
  //   textAlign(CENTER, CENTER);
  //   text(level, 0, 0);
  //   pop();
  // }

  // drawFinalWin() {
  //   background(255, 215, 0); // 金色背景
  //   textAlign(CENTER, CENTER);
  //   fill(0);
  //   textSize(50);
  //   text("一家團聚！", width / 2, height / 2);
  //   textSize(20);
  //   text("你成功幫蜥蜴媽媽找回了所有蛋", width / 2, height / 2 + 60);
  // }
}