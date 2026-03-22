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
    this.goalH =
    this.doorLockedImg.height * (this.goalW / this.doorLockedImg.width);
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
          { type: "Ant", x: 4550, y: 200, size: 50 },
          { type: "Ant", x: 5500, y: 20, size: 50 },
        ],
        //items
        items: [
          { element: Transform.Fire, x: 700, y: 400, size: 80 },
          { element: Transform.Frozen, x: 900, y: 400, size: 80 },
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
        ],
        items: [
          { element: Transform.Fire, x: 300, y: 200, size: 80 },
          { element: Transform.Frozen, x: 400, y: 200, size: 80 },
        ],
      },
      3: {
        mapData: this.mapsData[3],
        enemies: [
          { type: "Ant", x: 900, y: 800, size: 50 },
          { type: "Ant", x: 1800, y: 500, size: 50 },
          { type: "Ant", x: 2100, y: 500, size: 50 },
          { type: "Ant", x: 3600, y: 400, size: 50 },
          { type: "Ant", x: 4530, y: 200, size: 50 },
          { type: "Ant", x: 5100, y: 300, size: 50 },
        ],
        items: [
          { element: Transform.Fire, x: 300, y: 200, size: 80 },
          { element: Transform.Frozen, x: 400, y: 200, size: 80 },
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
      if (e.type === "Ant") entities.push(new Ant(e.x, e.y, e.size));
    }

    //Bees are coming~
    if (level >= 2) {
      entities.push(new Bees(2000, 350, 60, beeImgs));
      entities.push(new Bees(4000, 350, 60, beeImgs));
    }
  }

  spawnItems(level, entities) {
    let data = this.getLevelData(level);
    if (!data) return;
    let items = data.items || [];

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
    //Hearts appeared
    if (typeof heartImg !== "undefined" && heartImg) {
      let heartCount = floor(random(1, 4));
      for (let i = 0; i < heartCount; i++) {
        entities.push(
          new Heart(random(1500, 5000), random(300, 600), 40, 40, heartImg),
        );
      }
    }

    //Egg for Win the stages
    let door = this.goalPos[level];
    if (door) {
      let eggIndex = max(0, level - 1);
      let eggImg =
        levelEggImgs && levelEggImgs[eggIndex] ? levelEggImgs[eggIndex] : null;

      if (eggImg) {
        entities.push(new GoalEgg(400, 650, 60, 60, eggImg, level));
        console.log("Goal Egg generated successfully!");
      }
    }
  }

  getGoalPos() {
    return this.goalPos[this.currentLevel];
  }

  isReachedGoal(player, uiManager) {
    if (this.currentLevel !== 3 && uiManager.currentKeys < 3) {
      return false;
    }

    let goal = this.getGoalPos();
    if (!goal) {
      return false;
    }

    return (
      player.left < goal.x + this.goalW &&
      player.right > goal.x &&
      player.top < goal.y + this.goalH &&
      player.bottom > goal.y
    );
  }

  displayGoal() {
    let goal = this.getGoalPos();
    let img =
      uiManager.currentKeys >= 3 ? this.doorOpenImg : this.doorLockedImg;
    image(img, goal.x, goal.y, this.goalW, this.goalH);
  }

  nextLevel() {
    this.currentLevel++;
    return this.currentLevel <= this.maxLevel;
  }
}
