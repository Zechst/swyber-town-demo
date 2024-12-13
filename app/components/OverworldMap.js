import GameObject from "./GameObjects";
import Person from "./Person";
import utils from "./utils";
import "./OverworldMap";

export default class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;
    this.walls = config.walls || {};

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
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);

    this.addWall(x, y);
  }
}

// Ensure window is only accessed on the client side
if (typeof window !== "undefined") {
  window.OverworldMaps = {
    DemoShop: {
      lowerSrc: "/images/maps/DemoShopLower.png",
      upperSrc: "/images/maps/DemoShopUpper.png",
      gameObjects: {},
      // A mixture of single-grid walls and multi-grid walls
      walls: (() => {
        const walls = {};

        // Add single-grid walls
        [
          [1, 8],
          [4, 8],
          [1, 10],
          [4, 10],
          [5, 4],
          [7, 4],
          [9, 4],
          [13, 4],
          [1, 6],
          [4, 6],
          [18, 3],
          [9, 9],
        ].forEach(([x, y]) => {
          walls[utils.asGridCoords(x, y)] = true;
        });

        // Add multi-grid walls (horizontal and vertical lines)
        const addHorizontalWall = (startX, endX, y) => {
          for (let x = startX; x <= endX; x++) {
            walls[utils.asGridCoords(x, y)] = true;
          }
        };

        const addVerticalWall = (x, startY, endY) => {
          for (let y = startY; y <= endY; y++) {
            walls[utils.asGridCoords(x, y)] = true;
          }
        };

        // Example multi-grid walls
        addHorizontalWall(5, 11, 7); // Horizontal wall from (5, 7) to (11, 7)
        addHorizontalWall(5, 16, 11);
        addHorizontalWall(1, 3, 3);
        addHorizontalWall(1, 22, 2);
        addHorizontalWall(14, 15, 9);
        addHorizontalWall(13, 21, 7);
        addHorizontalWall(16, 20, 6);
        addHorizontalWall(19, 20, 4);
        addHorizontalWall(6, 7, 9);

        addVerticalWall(8, 7, 9); // Vertical wall from (8, 7) to (8, 9)

        addVerticalWall(0, 0, 11);
        addVerticalWall(5, 7, 11);
        addVerticalWall(11, 7, 9);
        addVerticalWall(13, 7, 9);
        addVerticalWall(21, 1, 5);

        return walls;
      })(),
    },
  };
}
