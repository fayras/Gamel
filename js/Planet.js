const THREE = require('three');
const Board = require('./Board');
const Cell = require('./Cell');

class Planet extends THREE.Group {
  constructor(radius, width, height) {
    super();

    this.radius = radius;
    this.width = width;
		this.height = height;

		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(radius, width, height),
      new THREE.MeshPhongMaterial({
      	color: 0x156289,
      	emissive: 0x072534,
      	side: THREE.DoubleSide,
        flatShading: true
      })
		);
		this.sphere.castShadow = true;
		this.sphere.receiveShadow = true;
		this.add(this.sphere);

		this.cells = [];
		this.cellsHashMap = this.createCells();

		this.board = new Board(height, width);

		this.pause = false;
  }

  createCells() {
		const modDigit = this.width % 2 === 0 ? 0 : 1;
		const hashMap = new Map();
    this.sphere.geometry.faces.forEach((face, index) => {
			const hash = this.getHashForFace(face);

      if(index < this.width || index >= this.sphere.geometry.faces.length - this.width) {
				let cell = new Cell(face.normal.clone().multiplyScalar(this.radius + 1));
				hashMap.set(hash, cell);
				this.cells.push(cell);
				this.add(cell);
				return;
			}

      if(index % 2 === modDigit) {
				let cell = new Cell(face.normal.clone().multiplyScalar(this.radius + 1));
				hashMap.set(hash, cell);
				this.cells.push(cell);
				this.add(cell);
				return;
			}

			let previousFace = this.sphere.geometry.faces[index - 1];
			let cell = hashMap.get(this.getHashForFace(previousFace));
			hashMap.set(hash, cell);
		});

		return hashMap;
	}

	update(dt) {
		if(!this.pause) this.board.update(dt);

		for(let index = 0; index < this.board.cells.length; index++) {
			let cell = this.cells[index];
			if(this.board.cells[index] === true) {
				cell.revive();
			} else if(this.board.cells[index] === false) {
				cell.kill();
			}
			cell.update(dt);
		}
	}

	getHashForFace(face) {
		return `(${face.a},${face.b},${face.c})`;
	}

	onClick(face) {
		let cell = this.cellsHashMap.get(this.getHashForFace(face));
		let index = this.cells.indexOf(cell);
		let state = cell.toggle();
		this.board.cells[index] = state;
	}

	reset() {
		for(let cell of this.cells) {
			cell.kill();
		}
		this.board.randomize();
	}
}

module.exports = Planet;
