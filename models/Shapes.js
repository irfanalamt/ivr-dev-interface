import Shape from './Shape';

class Shapes {
  constructor(groupname, shapes) {
    this.groupname = groupname;
    this.shapes = shapes;
  }
  setShapes(data) {
    let newShapesArray = [];
    data.forEach((el) => {
      let { x, y, width, height, type, name, userValues } = el;
      console.log('set shapes', name, type);
      let newShape = new Shape(x, y, width, height, type, null, true);
      newShape.setText(name);
      newShapesArray.push(newShape);
      newShape.setUserValues(userValues);
    });
    let newShapes = new Shapes('stage', newShapesArray);
    return newShapes;
  }

  drawConnections(ctx) {
    this.shapes.forEach((shape, i) => {
      if (shape.nextItem) {
        const pos = this.shapes.findIndex((el) => el.text === shape.nextItem);
        if (pos !== -1) {
          this.connectPoints(
            ctx,
            this.shapes[i].getExitPoint(),
            this.shapes[pos].getEntryPoint()
          );
          console.log('entry:', this.shapes[i].getExitPoint());
          console.log('exit:', this.shapes[pos].getEntryPoint());
        }
      }
    });
  }

  connectPoints(ctx, point1, point2) {
    console.log('line from', point1, point2);
    const headLength = 12;
    let dx = point2[0] - point1[0];
    let dy = point2[1] - point1[1];
    let angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(point1[0], point1[1]);
    ctx.lineTo(point2[0], point2[1]);
    ctx.lineTo(
      point2[0] - headLength * Math.cos(angle - Math.PI / 6),
      point2[1] - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(point2[0], point2[1]);
    ctx.lineTo(
      point2[0] - headLength * Math.cos(angle + Math.PI / 6),
      point2[1] - headLength * Math.sin(angle + Math.PI / 6)
    );

    ctx.strokeStyle = '#424242';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
  }

  displayAll() {
    return `name=${this.groupname} shapes=${this.shapes}`;
  }
  getShapes() {
    return this.shapes;
  }
  addShape(newShape) {
    this.shapes.push(newShape);
  }
}

export default Shapes;
