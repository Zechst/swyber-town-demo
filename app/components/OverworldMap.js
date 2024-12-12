import GameObject from "./GameObjects";
import Person from "./Person";
import utils from "./utils";
import "./OverworldMap";

export default class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    // return this.walls[`${x},${y}`] || false;
    const result = this.walls[`${x},${y}`] || false;

    console.log("Walls:", this.walls);

    console.log(
      `Checking collision at (${x}, ${y}) for direction ${direction}:`,
      result
    );

    return result;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;
      //TODO: determine if this object should actually mount
      object.mount(this);
    });
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`];
  }
  moveWall(wasX, wasY, direction) {
    console.log(
      `Moving wall from (${wasX}, ${wasY}) in direction ${direction}`
    );

    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    console.log(`Adding wall at (${x}, ${y})`);

    this.addWall(x, y);
  }
}

// Ensure window is only accessed on the client side
if (typeof window !== "undefined") {
  window.OverworldMaps = {
    DemoShop: {
      lowerSrc: "/images/maps/DemoShopLower.png",
      upperSrc: "/images/maps/DemoShopUpper.png",
      gameObjects: {
        hero: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(11),
          y: utils.withGrid(5),
        }),
      },
    },
  };
}
