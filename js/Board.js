class Board {
  constructor(rows, columns) {
    this.columns = columns;
    this.rows = rows;
    this.cells = new Array(rows * columns);
    this.next = new Array(rows * columns);
    // this.positions = positions;
    this.randomize();
    this.time = 0;
  }

  randomize() {
    this.next.fill(undefined);
    for(let r = 0; r < this.rows; r++) {
      let rIndex = r * this.columns;
      for(let c = 0; c < this.columns; c++) {
        let index = rIndex + c;
        // let position = this.positions[index];
        let cell;
        if(Math.random() < 0.1) {
          cell = true; // new Cell(position, Cell.ALIVE);
        } else {
          cell = false; // new Cell(position, Cell.DEAD);
        }
        // this.add(cell);
        this.cells[index] = cell;
      }
    }
  }

  cellAlive(row, col) {
    let cell = this.getCell(row, col);
    return cell === true;
  }

  getCell(row, col) {
    if(row < 0 || row >= this.rows.length) return null;

    let x = row.mod(this.rows);
    let y = col.mod(this.columns);
    return this.cells[this.rows * x + y];
  }

  setCell(row, col, value) {
    if(row < 0 || row >= this.rows.length) return;

    let x = row.mod(this.rows);
    let y = col.mod(this.columns);
    return this.next[this.rows * x + y] = value;
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

        if(this.cellAlive(r, c) && counter < 2) this.setCell(r, c, false);
        if(this.cellAlive(r, c) && (counter > 1 && counter < 4)) this.setCell(r, c, true);
        if(this.cellAlive(r, c) && counter > 3) this.setCell(r, c, false);
        if(!this.cellAlive(r, c) && counter === 3) this.setCell(r, c, true);
      }
    }
    this.cells = [ ...this.next ];
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