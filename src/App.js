import "babel-polyfill";

import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BoggleSolverDisplay from './components/BoggleSolverDisplay.js';
import TreePruningSolver from './solvers/TreePruningSolver.js';
import DictionaryListSolver from './solvers/DictionaryListSolver.js';
import Trie from './solvers/Trie.js';
import dict from 'raw!./dict.txt';

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
    const dictionaryList = dict.split(/\s+/);
    const trie = Trie.fromDictionaryList(dictionaryList);

    this.state = {
      grid: grid,
      solvers: [
        // Don't prune
        TreePruningSolver(grid,
          prefix => trie.hasWord(prefix),
          prefix => true),

        // Search for each word in the dictionary one-by-one
        DictionaryListSolver(grid, dictionaryList),

        // Prune by only allowing prefixes of words in the dictionary
        TreePruningSolver(grid,
          prefix => trie.hasWord(prefix),
          prefix => trie.hasWordWithPrefix(prefix)),
      ]
    };
  }

  render() {
    const { grid, solvers } = this.state;

    return <div className={css(styles.sideBySide)}>
      {solvers.map((solver, i) => {
        return (
          <div className={css(styles.solverDisplay)}>
            <BoggleSolverDisplay
              key={i}
              grid={grid}
              solver={solver} />
          </div>
        );
      })}
    </div>
  }
};

const styles = StyleSheet.create({
  sideBySide: {
    margin: 50,
  },
  solverDisplay: {
    float: 'left',
    width: 200,
  }
});

