export const shipCoords = (item, withArea) => {
  item = Object.assign({}, item);
  const XY = [];
  const X = [];
  const Y = [];

  if (item.orientation) {
    item.w = item.orientation === 'horizontal' ? parseInt(item.ship[0], 10) : 1;
    item.h = item.orientation === 'vertical' ? parseInt(item.ship[0], 10) : 1;
  }
  const x0 = withArea ? item.x - 1 : item.x;
  const y0 = withArea ? item.y - 1 : item.y;
  const maxX = withArea ? item.x + item.w : item.x + item.w - 1;
  const maxY = withArea ? item.y + item.h : item.y + item.h - 1;

  for (let x = x0; x <= maxX; x++) {
    if (x >= 0 && x <= 9) {
      X.push(x);
    }
  }

  for (let y = y0; y <= maxY; y++) {
    if (y >= 0 && y <= 9) {
      Y.push(y);
    }
  }

  Y.forEach((y) => {
    X.forEach((x) => {
      XY.push(`${x}${y}`);
    });
  });
  return XY;
};
