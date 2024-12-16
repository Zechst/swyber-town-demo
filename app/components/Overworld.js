import OverworldMap from "./OverworldMap";
import DirectionInput from "./DirectionInput";

export default class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector("#game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
    this.playerId = config.playerId;

    // Match canvas size to the container
    this.canvas.width = this.element.offsetWidth;
    this.canvas.height = this.element.offsetHeight;
  }

  gameLoopStepWork() {
    //Clear off the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Establish the camera person
    const cameraPerson = this.map.gameObjects[this.playerId];
    // console.log(
    //   `Player's current position: (${cameraPerson.x / 32}, ${
    //     cameraPerson.y / 32
    //   })`
    // );

    //Update all objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.update({
        arrow: this.directionInput.direction,
        map: this.map,
      });
    });

    //Draw Lower layer
    this.map.drawLowerImage(this.ctx, cameraPerson);

    //Draw Game Objects
    Object.values(this.map.gameObjects).forEach((object) => {
      object.sprite.draw(this.ctx, cameraPerson);
    });

    //Draw Upper layer
    this.map.drawUpperImage(this.ctx, cameraPerson);
  }

  startGameLoop() {
    let previousMs;
    const step = 1 / 60;

    const stepFn = (timestampMs) => {
      if (previousMs === undefined) {
        previousMs = timestampMs;
      }
      let delta = (timestampMs - previousMs) / 1000;
      while (delta >= step) {
        this.gameLoopStepWork();
        delta -= step;
      }
      previousMs = timestampMs - delta * 1000;

      //Business as usual tick
      requestAnimationFrame(stepFn);
    };
    //First kickoff tick
    requestAnimationFrame(stepFn);
  }

  init() {
    if (this.isGameLoopStarted) return; // Prevent init from running twice

    if (typeof window === "undefined" || !window.OverworldMaps) {
      console.error("OverworldMaps is not defined.");
      return;
    }

    console.log("OverworldMaps:", window.OverworldMaps);
    this.map = new OverworldMap(window.OverworldMaps.DemoShop);
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
  }
}
