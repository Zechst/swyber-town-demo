const utils = {
  withGrid(n) {
    return n * 32; // Ensure matches your game's scaling
  },
  asGridCoords(x, y) {
    return `${x * 32},${y * 32}`; // Adjust for grid size
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 32; // Adjust for grid size
    if (direction === "left") x -= size;
    else if (direction === "right") x += size;
    else if (direction === "up") y -= size;
    else if (direction === "down") y += size;
    return { x, y };
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail,
    });
    document.dispatchEvent(event);
  },
};

export default utils;
