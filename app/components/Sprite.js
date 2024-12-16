import utils from "./utils";

export default class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // //Shadow
    // this.shadow = new Image();
    // this.shadow.onload = () => {
    //   this.isShadowLoaded = true;
    // };
    // this.useShadow = true; //config.useShadow || false
    // if (this.useShadow) {
    //   this.shadow.src = "/images/characters/shadow.png";
    // }

    //Configure Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [
        [3, 0],
        [18, 1],
        [19, 1],
        [20, 1],
        [21, 1],
        [22, 1],
        [23, 1],
      ],
      "idle-right": [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
      ],
      "idle-up": [
        [1, 0],
        [6, 1],
        [7, 1],
        [8, 1],
        [9, 1],
        [10, 1],
        [11, 1],
      ],
      "idle-left": [
        [2, 0],
        [12, 1],
        [13, 1],
        [14, 1],
        [15, 1],
        [16, 1],
        [17, 1],
      ],
      "walk-down": [
        [18, 2],
        [19, 2],
        [20, 2],
        [21, 2],
        [22, 2],
        [23, 2],
      ],
      "walk-right": [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
        [5, 2],
      ],
      "walk-up": [
        [6, 2],
        [7, 2],
        [8, 2],
        [9, 2],
        [10, 2],
        [11, 2],
      ],
      "walk-left": [
        [12, 2],
        [13, 2],
        [14, 2],
        [15, 2],
        [16, 2],
        [17, 2],
      ],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8;
    this.animationFrameProgress = this.animationFrameLimit;

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    //Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    //Reset the counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame += 1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x - 18 + utils.withGrid(10.5) - cameraPerson.x;
    const y = this.gameObject.y - 25 - 18 + utils.withGrid(6) - cameraPerson.y;

    // this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

    const [frameX, frameY] = this.frame;

    this.isLoaded &&
      ctx.drawImage(this.image, frameX * 32, frameY * 64, 32, 64, x, y, 32, 64);

    this.updateAnimationProgress();
  }
}
