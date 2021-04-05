const RAINWIDTH = 0.5;
const RAINHEIGHT = 20;

export class Rain {
  constructor(box) {
    this.startX = 0;
    this.startY = 0;
    this.stageWidth;
    this.stageHeight;
    this.maxRain;
    this.box = box;
  }

  resize(width, height) {
    this.stageWidth = width;
    this.stageHeight = height;

    this.startX = Math.random() * this.stageWidth;
    this.startY = Math.random() * this.stageHeight;
  }

  animate(ctx) {
    this.startY += 2;
    if (this.startY > this.stageHeight) {
      this.startX = Math.random() * this.stageWidth;
      this.startY = (Math.random() * this.stageHeight) / 10;
    }
    ctx.beginPath();
    ctx.fillStyle = "skyblue";
    ctx.fillRect(this.startX, this.startY, RAINWIDTH, RAINHEIGHT);
  }
}
