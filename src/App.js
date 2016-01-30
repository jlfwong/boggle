import "babel-polyfill";

import React, { Component } from 'react';

import BoggleTray from './components/BoggleTray.js';
import TreePruningSolver from './solvers/TreePruningSolver.js';
import WordSet from './solvers/WordSet.js';
import dict from 'json!./dict.json';

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
  constructor(props) {
    super();

    const grid = randomGrid();

    this.state = {
      grid: grid,
      path: [],
      solver: TreePruningSolver(grid, new WordSet(dict)),
    };

    this.tick = this.tick.bind(this);
  }

  tick() {
    const next = this.state.solver.next();
    if (!next.done) {
      const [path, candidateWord, wordIsInDictionary] = next.value;

      this.setState({
        path: path,
        pathTracesWord: wordIsInDictionary
      });
      if (wordIsInDictionary) {
        // If the word is in the dictionary, pause 300ms per letter in the word
        setTimeout(this.tick, 300 * candidateWord.length);
      } else {
        setTimeout(this.tick, 100);
      }
    } else {
      this.setState({
        path: []
      });
    }
  }

  componentDidMount() {
    this.tick();
  }

  render() {
    const {grid, path, pathTracesWord} = this.state;

    return (
      <div style={{margin: 50}}>
        <BoggleTray
          grid={grid}
          path={path}
          pathTracesWord={pathTracesWord} />
      </div>
    );
  }
};
