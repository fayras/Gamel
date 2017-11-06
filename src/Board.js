const THREE = require('three');
const Cell = require('./Cell');

class Board extends THREE.Group {
  constructor(rows, columns, positions) {
    super();
    this.columns = columns;
    this.rows = rows;
    this.cells = new Array(rows * columns);
    this.positions = positions;
    this.randomize();
    this.time = 0;
    // this.setOldCell(1, 0, new Cell(0, 1));
    // this.setOldCell(1, 1, new Cell(0, 0));
    // this.setOldCell(1, 2, new Cell(0, 0));
  }

  randomize() {
    for(let r = 0; r < this.rows; r++) {
      let rIndex = r * this.rows;
      for(let c = 0; c < this.columns; c++) {
        let index = rIndex + c;
        let position = this.positions[index];
        let cell;
        if(Math.random() < 0.7) {
          cell = new Cell(position, Cell.ALIVE);
        } else {
          cell = new Cell(position, Cell.DEAD);
        }
        this.add(cell);
        this.cells[index] = cell;
      }
    }
  }

  cellAlive(row, col) {
    let cell = this.getCell(row, col);
    if(cell === null) {
      return false;
    }

    return cell.isAlive();
  }

  getCell(row, col) {
    if(row < 0 || row > this.row) return null;

    let x = row.mod(this.rows);
    let y = col.mod(this.columns);
    return this.cells[this.rows * x + y];
  }

  setCell(row, col, value) {
    if(row < 0 || row > this.row) return;

    let x = row.mod(this.rows);
    let y = col.mod(this.columns);
    return this.next[this.rows * x + y].status = value;
  }

  nextGeneration() {
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

        if(this.cellAlive(r, c) && counter < 2) this.getCell(r, c).kill();
        if(this.cellAlive(r, c) && (counter > 1 && counter < 4)) this.getCell(r, c).revive();
        if(this.cellAlive(r, c) && counter > 3) this.getCell(r, c).kill();
        if(!this.cellAlive(r, c) && counter === 3) this.getCell(r, c).revive();
      }
    }
  }

  update(dt) {
    this.time += dt;
    if(this.time > 1000) {
      this.nextGeneration();
      this.time = 0;
    }
    
    for(let cell of this.cells) {
      cell.update(dt);
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
