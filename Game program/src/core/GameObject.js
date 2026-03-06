class GameObject {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.width = 40;
    this.height = 40;
    this.isDead = false;
  }

  // 每個子類別必須實作這兩個方法
  update() {
    throw new Error("Missing update() implementation");
  }

  display() {
    throw new Error("Missing display() implementation");
  }
}