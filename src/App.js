import React, { Component } from 'react';
import BoggleTray from './components/BoggleTray.js';

const RP = React.PropTypes;

const CUBE_WIDTH = 40;
const CUBE_SPACING = 5;

const NUM_ROWS = 4;
const NUM_COLS = 4;

// From bananagrammer.com
const ALL_CUBES = [
  "AACIOT",
  "ABILTY",
  "ABJMOQ",
  "ACDEMP",
  "ACELRS",
  "ADENVZ",
  "AHMORS",
  "BIFORX",
  "DENOSW",
  "DKNOTU",
  "EEFHIY",
  "EGKLUY",
  "EGINTV",
  "EHINPS",
  "ELPSTU",
  "GILRUW"
].map(line => line.split("").map(letter => letter == 'Q' ? 'Qu' : letter));

const randomGrid = () => {
  const cubes = ALL_CUBES.map(
    sides => sides[Math.floor(Math.random() * sides.length)]
  );

  const ret = [];
  for (let r = 0; r < NUM_ROWS; r++) {
    const row = [];
    for (let c = 0; c < NUM_COLS; c++) {
      row.push(cubes.pop());
    }
    ret.push(row);
  }
  return ret;
};

export class App extends Component {
  render() {
    const grid = randomGrid();

    const path = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2]
    ];

    return (
      <div style={{margin: 50}}>
        <BoggleTray grid={grid} path={path} />
      </div>
    );
  }
};
