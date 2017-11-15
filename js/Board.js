class Board {
  constructor(rows, columns) {
    this.columns = columns;
    this.rows = rows;
    this.cells = new Array(rows * columns);
    this.next = new Array(rows * columns);
    this.onChangeFunc = null;
  }

  randomize() {
    this.time = 0;
    this.next.fill(undefined);
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        if(Math.random() < 0.1) {
          this.setCurrentCell(r, c, true); // new Cell(position, Cell.ALIVE);
        } else {
          this.setCurrentCell(r, c, false); // new Cell(position, Cell.DEAD);
        }
      }
    }
  }

  cellAlive(row, col) {
    let cell = this.getCell(row, col);
    return cell === true;
  }

  getIndex(row, col) {
    if(row < 0 || row >= this.rows.length) return undefined;

    let x = row.mod(this.rows);
    let y = col.mod(this.columns);
    return this.columns * x + y;
  }

  getCell(row, col) {
    let index = this.getIndex(row, col);

    if(index === undefined) return;

    return this.cells[index];
  }

  setCurrentCell(row, col, value) {
    let index = this.getIndex(row, col);
    if(index === undefined) return;

    if(this.onChangeFunc !== null) {
      this.onChangeFunc(index, value);
    }
    return this.cells[index] = value;
  }

  setNextCell(row, col, value) {
    let index = this.getIndex(row, col);
    if(index === undefined) return;

    if(this.onChangeFunc !== null && value !== this.cells[index]) {
      this.onChangeFunc(index, value);
    }
    return this.next[index] = value;
  }

  nextGeneration() {
    this.next.fill(undefined);
    for(let r = 0; r < this.rows; r++) {
      for(let c = 0; c < this.columns; c++) {
        let counter = 0;
        if(this.cellAlive(r - 1, c - 1)) counter++;
        if(this.cellAlive(r, c - 1)) counter++;
        if(this.cellAlive(r + 1, c - 1)) counter++;
        if(this.cellAlive(r - 1, c)) counter++;
        if(this.cellAlive(r + 1, c)) counter++;
        if(this.cellAlive(r - 1, c + 1)) counter++;
        if(this.cellAlive(r, c + 1)) counter++;
        if(this.cellAlive(r + 1, c + 1)) counter++;

        if(this.cellAlive(r, c) && counter < 2) this.setNextCell(r, c, false);
        if(this.cellAlive(r, c) && (counter > 1 && counter < 4)) this.setNextCell(r, c, true);
        if(this.cellAlive(r, c) && counter > 3) this.setNextCell(r, c, false);
        if(!this.cellAlive(r, c) && counter === 3) this.setNextCell(r, c, true);
      }
    }
    this.cells = [ ...this.next ];
  }

  onChange(func) {
    this.onChangeFunc = func;
  }

  update(dt) {
    this.time += dt;
    if(this.time > 1500) {
      this.nextGeneration();
      this.time = 0;
    }
  }

  toString() {
    let string = '\n';
    for(let row = 0; row < this.rows; row++) {
      for(let col = 0; col < this.columns; col++) {
        string += (this.cellAlive(row, col) ? '*' : '-');
      }
      string += '\n';
    }
    return string;
  }
}

module.exports = Board;
