class LevelManager {
  constructor(map1Data, map2Data, goalImg) {
    this.currentLevel = 1;
    this.maxLevel = 2;
    this.mapsData = {1: map1Data, 2: map2Data};
    this.goalImg = goalImg;
    this.goalPos = {
        1: {x: 5880, y: 600},
        2: {x: 5860, y: 840}
    }
    this.goalW = 100;
    this.goalH = goalImg.height * (this.goalW / goalImg.width);
  }



  getLevelData(level) {
    const levels = {
      1: {
        mapData: this.mapsData[1],
        enemies: [
            {type: 'Ant', x: 400, y: 400, size: 50},
            {type: 'Ant', x: 1400, y: 400, size: 50},
            {type: 'Ant', x: 2600, y: 400, size: 50},
            {type: 'Ant', x: 4000, y: 400, size: 50},
            {type: 'Ant', x: 5500, y: 20, size: 50},
          ],
        //items
        items: [
          {element: Transform.Fire, x: 700, y: 400, size: 80},
          {element: Transform.Frozen, x: 900, y: 400, size: 80}
        ]
      },
      2: {
        mapData: this.mapsData[2],
        enemies: [
            {type: 'Ant', x: 900, y: 800, size: 50},
            {type: 'Ant', x: 1800, y: 500, size: 50},
            {type: 'Ant', x: 2100, y: 500, size: 50},
            {type: 'Ant', x: 3600, y: 400, size: 50},
            {type: 'Ant', x: 4530, y: 200, size: 50},
            {type: 'Ant', x: 5100, y: 300, size: 50},
        ],
        items: [
          {element: Transform.Fire, x: 300, y: 200, size: 80},
          {element: Transform.Frozen, x: 400, y: 200, size: 80}
        ]
      }
    };
    return levels[level];
  }


  spawnEnemies(level, entities) {
    let data = this.getLevelData(level);
    let enemies = data.enemies;
    
    for (let e of enemies) {
      if (e.type === 'Ant') entities.push(new Ant(e.x, e.y, e.size));
    }
  }

  spawnItems(level, entities) {
      let data = this.getLevelData(level);
      let items = data.items || [];

      for (let i of items) {
          let img = null;
          if (i.element === Transform.Fire) {
              img = redButterfly;  
          } else if (i.element === Transform.Frozen) {
              img = blueButterfly; 
          }
          entities.push(new Items(i.x, i.y, i.size * 1.5, i.size, img, i.element));
      }
  }

    getGoalPos() {
    return this.goalPos[this.currentLevel];
  }

  isReachedGoal(player) {
    let goal = this.getGoalPos();
    return player.left < goal.x + this.goalW &&
           player.right > goal.x &&
           player.top < goal.y + this.goalH &&
           player.bottom > goal.y;
  }

  displayGoal() {
    let goal = this.getGoalPos();
    image(this.goalImg, goal.x, goal.y, this.goalW, this.goalH);
  }

  nextLevel() {
    this.currentLevel++;
    return this.currentLevel <= this.maxLevel;
  }
}