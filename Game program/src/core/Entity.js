class Entity {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;

    this.active = true
  }

  // 每個子類別必須實作這兩個方法
  update() {
    throw new Error("Missing update() implementation");
  }

  display() {
    throw new Error("Missing display() implementation");
  }

  get left()   { return this.pos.x }
  get right()  { return this.pos.x + this.width }
  get top()    { return this.pos.y }
  get bottom() { return this.pos.y + this.height }

}