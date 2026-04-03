class LevelManager {
  constructor(
    map0Data,
    map1Data,
    map2Data,
    map3Data,
    doorLockedImg,
    doorOpenImg,
  ) {
    this.currentLevel = 1;
    this.maxLevel = 3;
    this.mapsData = { 0: map0Data, 1: map1Data, 2: map2Data, 3: map3Data };
    this.doorLockedImg = doorLockedImg;
    this.doorOpenImg = doorOpenImg;
    this.goalPos = {
      0: { x: 4620, y: 476 },
      1: { x: 5750, y: 596 },
      2: { x: 8800, y: 476 },
      3: { x: 7050, y: 656 },
    };
    this.goalW = 150;
    this.goalH = this.doorLockedImg.height * (this.goalW / this.doorLockedImg.width);
  }

  getLevelData(level) {
    const levels = {
      0: {
        mapData: this.mapsData[0],
        enemies: [
          { type: "Ant", x: 1000, y: 400, size: 50 },
          { type: "Ant", x: 2480, y: 400, size: 50 },
          { type: "Ant", x: 3640, y: 400, size: 50 },
        ],
        //items
        items: [
          { element: Transform.Fire, x: 3430, y: 500, size: 80 },
          { element: Transform.Frozen, x: 2210, y: 550, size: 80 },
        ],
      },
      1: {
        mapData: this.mapsData[1],
        enemies: [
          { type: "Ant", x: 1400, y: 400, size: 50 },
          { type: "Ant", x: 1750, y: 300, size: 50 },
          { type: "Ant", x: 2350, y: 200, size: 50 },
          { type: "Ant", x: 5500, y: 20, size: 50 },
        ],
      },
      2: {
        mapData: this.mapsData[2],
        enemies: [
          { type: "Ant", x: 850, y: 400, size: 50 },
          { type: "Ant", x: 1800, y: 500, size: 50 },
          { type: "Ant", x: 2100, y: 500, size: 50 },
          { type: "Ant", x: 3600, y: 400, size: 50 },
          { type: "Ant", x: 4530, y: 200, size: 50 },
          { type: "Ant", x: 5100, y: 300, size: 50 },
          { type: "Ant", x: 6600, y: 300, size: 50 },
          { type: "Ant", x: 7000, y: 300, size: 50 },
          { type: "Bee", x: 3000, y: 450, size: 60 },
          { type: "Bee", x: 4000, y: 350, size: 60 }
        ],
        items: [
          { element: Transform.Frozen, x: 1270, y: 600, size: 80 },
          { element: Transform.Frozen, x: 3000, y: 550, size: 80 },
          { element: Transform.Frozen, x: 5420, y:550, size: 80 },
        ],
      },
      3: {
        mapData: this.mapsData[3],
        enemies: [
          { type: "Ant", x: 450, y: 800, size: 50 },
          { type: "Ant", x: 1800, y: 500, size: 50 },
          { type: "Ant", x: 2100, y: 500, size: 50 },
          { type: "Ant", x: 3600, y: 400, size: 50 },
          { type: "Ant", x: 4530, y: 200, size: 50 },
          { type: "Ant", x: 5100, y: 300, size: 50 },
          { type: "Bee", x: 1100, y: 430, size: 60 },
          { type: "Bee", x: 4300, y: 320, size: 60 },
          { type: "Bee", x: 5400, y: 600, size: 60 },
          { type: "Boss", x: 6300, y: 300, size: 100 }
        ],
        items: [
          { element: Transform.Fire, x: 980, y: 570, size: 80 },
          { element: Transform.Fire, x: 2930, y: 670, size: 80 },
          { element: Transform.Fire, x: 5510, y: 770, size: 80 }
        ],
      },
    };
    return levels[level];
  }

  getTutorialTexts(tutorialTextImg) {
    return [
      { img: tutorialTextImg[0], triggerX: 0, endX: 400 },
      { img: tutorialTextImg[1], triggerX: 500, endX: 1000 },
      { img: tutorialTextImg[2], triggerX: 1150, endX: 1850 },
      { img: tutorialTextImg[3], triggerX: 2040, endX: 2480 },
      { img: tutorialTextImg[4], triggerX: 2500, endX: 3180 },
      { img: tutorialTextImg[5], triggerX: 3320, endX: 3700 },
      { img: tutorialTextImg[6], triggerX: 4300, endX: 4600 },
    ];
  }

  getCutscenes(level, cutsceneImgs) {
    const cutscenes = {
      0: [],
      1: [cutsceneImgs[0], cutsceneImgs[1], cutsceneImgs[2]],
      2: [],
      3: [cutsceneImgs[3]],
    };
    return cutscenes[level] || [];
  }

  spawnEnemies(level, entities) {
    let data = this.getLevelData(level);
    let enemies = data.enemies;

    for (let e of enemies) {
      if (e.type === "Ant") {
        entities.push(new Ant(e.x, e.y, e.size));
      }
      else if (e.type === "Bee") { 
        entities.push(new Bees(e.x, e.y, e.size, beeImgs));
      }
      else if (e.type === "Boss") {
        entities.push(new Boss(e.x, e.y, e.size, e.size, badbunnyImgs, carrotImg));
      }
    }
  }

  spawnItems(level, entities) {
    let data = this.getLevelData(level);
    if (!data) return;
    let items = data.items || [];
  //Fire and Ice 
    for (let i of items) {
      let img = null;
      if (typeof Transform !== "undefined") {
        if (i.element === Transform.Fire) {
          img = redButterfly;
        } else if (i.element === Transform.Frozen) {
          img = blueButterfly;
        }
        if (img) {
          entities.push(
            new Items(i.x, i.y, i.size * 1.5, i.size, img, i.element),
          );
        }
      }
    }
  //Heart (Only generate 1 heart per game)
    if (typeof heartImg !== "undefined" && heartImg) {
      let heartSpawnX = 1250;
      let heartSpawnY = 500;
      
      if (level === 1){
        heartSpawnX = 3300;
        heartSpawnY = 450;
      }
      else if (level === 2){
        heartSpawnX = 2500;
        heartSpawnY = 450;
      }
      else if (level === 3){
        heartSpawnX = 3800;
        heartSpawnY = 350;
      }
      entities.push(new Heart(heartSpawnX, heartSpawnY, 40, 40, heartImg));
    }

    //Egg (Only appear in stage 3)
    //Set the position of the eggs
    if (level === 3){
      let eggPosition = [{x:1600, y:460}, {x:6880, y:300}, {x:6930, y:300}]
      
      for (let i = 0;  i < eggPosition.length; i++) {
        let eggImg = (levelEggImgs && levelEggImgs[i]) ? levelEggImgs[i] : null;
              
        if (eggImg){
          entities.push(new GoalEgg(eggPosition[i].x, eggPosition[i].y, 60, 60, eggImg, i + 1));
        }
      }
    }
  }

  getGoalPos() {
    return this.goalPos[this.currentLevel];
  }

  isReachedGoal(player, uiManager) {
    
    if (this.currentLevel === 3) {
      // Level 3
      if (!uiManager.eggCount || uiManager.eggCount < 3) return false;
    } 
    else {
      // Level 1 and 2 need 3 keys
      if (uiManager.currentKeys < 3) return false;
    }

    
    let goal = this.getGoalPos();
    if (!goal) return false;

    return (
      player.left < goal.x + this.goalW &&
      player.right > goal.x &&
      player.top < goal.y + this.goalH &&
      player.bottom > goal.y
    );
  }

  displayGoal() {
    let goal = this.getGoalPos();
    let isConditionMet = uiManager.currentKeys >= 3 || (this.currentLevel === 3 && uiManager.eggCount >= 3);

    let img = isConditionMet ? this.doorOpenImg : this.doorLockedImg;
  
    image(img, goal.x, goal.y, this.goalW, this.goalH);
  }

  nextLevel() {
    this.currentLevel++;
    return this.currentLevel <= this.maxLevel;
  }
}