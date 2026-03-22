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
  }

  getScaledHeight(img, targetW) {
    return img.height * (targetW / img.width);
  }

  displayStart(titleImg, startBtnImg, tutorialBtnImg) {
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
        tint(225, 150);
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
      } else {
        tint(255, 50);
      }
      let xPos = this.x + (i * this.gap);
      image(heartImg, xPos, this.y, this.heartsSize, this.heartsSize);
    }
    if (levelManager.currentLevel !== 3) {
      for (let i = 0; i < this.maxKeys; i++) {
        if (i < this.currentKeys) {
          tint(255, 255);
        } else {
          tint(255, 50);
        }
        let keyX = width - this.x - (i + 1) * this.gap;
        image(keyImg, keyX, this.y, this.keySize, this.keySize);
      }
    }
    noTint();
  }
}