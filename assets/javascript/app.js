import { Rain } from "./rain.js";

class App {
  constructor() {
    this.canvas = document.querySelector('#c');
    this.ctx = this.canvas.getContext("2d");

    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    window.addEventListener("resize", this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.header = document.querySelector(".header");
    this.canvas.width = this.header.clientWidth;
    this.canvas.height = this.header.clientHeight+100;
    this.stageWidth = this.canvas.width;
    this.stageHeight = this.canvas.height;

    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.totalRain = (this.stageWidth / 80) * (this.stageHeight / 80) * 5;
    this.rains = [];
    for (let i = 0; i < this.totalRain; i++) {
      this.rains[i] = new Rain(this.rect);
    }

    for (let i = 0; i < this.rains.length; i++) {
      this.rains[i].resize(this.stageWidth, this.stageHeight);
    }
  }

  animate() {
    window.requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.rains.length; i++) {
      this.rains[i].animate(this.ctx);
    }
  }
}

window.onload = () => {
  new App();
};
