import GameObject from "./GameObjects";

export default class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects;

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperSrc = config.upperSrc;
  }

  drawLowerImage(ctx) {
    ctx.drawImage(this.lowerImage, 0, 0);
  }

  drawUpperImage(ctx) {
    ctx.drawImage(this.upperImage, 0, 0);
  }
}

// Ensure window is only accessed on the client side
if (typeof window !== "undefined") {
  window.OverworldMaps = {
    DemoRoom: {
      lowerSrc: "/images/maps/DemoShopLower.png",
      upperSrc: "/images/maps/DemoUpper.png",
      gameObjects: {
        hero: new GameObject({
          x: 11,
          y: 3,
        }),
      },
    },
  };
}
