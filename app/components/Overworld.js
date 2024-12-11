import OverworldMap from "./OverworldMap";

export default class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector("#game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;

    // Match canvas size to the container
    this.canvas.width = this.element.offsetWidth;
    this.canvas.height = this.element.offsetHeight;
  }

  startGameLoop() {
    const step = () => {
      //Clear off the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Draw Lower layer
      this.map.drawLowerImage(this.ctx);

      //Draw Game Objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.sprite.draw(this.ctx);
      });

      //Draw Upper layer
      this.map.drawUpperImage(this.ctx);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
    this.startGameLoop();
  }
}
