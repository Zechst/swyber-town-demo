export default class Sprite {
  constructor(config) {
    //Set up the image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    //Configure Animation & Initial State
    this.animations = config.animations || {
      idleDown: [[0, 0]],
    };
    this.currentAnimation = config.currentANimation || "idleDown";
    this.currentAnimationFrame = 0;

    //Reference the game object
    this.gameObject = config.gameObject;
  }

  draw(ctx) {
    const x = this.gameObject.x * 32 - 16;
    const y = this.gameObject.y * 32 + 5;

    this.isLoaded &&
      ctx.drawImage(
        this.image,
        96, // left cut
        16, //top cut
        32,
        48,
        x,
        y,
        32,
        48
      );
  }
}
