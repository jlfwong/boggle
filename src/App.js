import "babel-polyfill";

import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BoggleSolverDisplay from './components/BoggleSolverDisplay.js';
import BacktrackingPathGenerator from './lib/BacktrackingPathGenerator.js';
import DictionaryListPathGenerator from './lib/DictionaryListPathGenerator.js';
import filterDictionaryByFrequency from './lib/filterDictionaryByFrequency.js';
import filterDictionaryByPossiblePaths from './lib/filterDictionaryByPossiblePaths.js';
import Trie from './lib/Trie.js';
import dict from 'raw!./dict.txt';

const NUM_ROWS = 3;
const NUM_COLS = 3;

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

const shuffledCubes = () => ALL_CUBES.map(
  sides => sides[Math.floor(Math.random() * sides.length)]
);

const randomGrid = () => {
  let cubes = shuffledCubes();

  const ret = [];
  for (let r = 0; r < NUM_ROWS; r++) {
    const row = [];
    for (let c = 0; c < NUM_COLS; c++) {
      row.push(cubes.pop());
      if (cubes.length === 0) {
        cubes = shuffledCubes();
      }
    }
    ret.push(row);
  }
  return ret;
};

const dictionaryList = dict.split(/\s+/).filter(x => x.length > 0);
const trie = Trie.fromDictionaryList(dictionaryList);

export class App extends Component {
  constructor(props) {
    super();

    const grid = randomGrid();

    const freqFilteredDictionaryList = filterDictionaryByFrequency(
                                            grid,
                                            dictionaryList);

    const freqFilteredTrie = Trie.fromDictionaryList(
                                freqFilteredDictionaryList);

    const pathFilteredDictionaryList = filterDictionaryByPossiblePaths(
                                            grid,
                                            dictionaryList);

    const pathFilteredTrie = Trie.fromDictionaryList(
                                pathFilteredDictionaryList);

    console.log(dictionaryList.length,
                freqFilteredDictionaryList.length,
                pathFilteredDictionaryList.length);

    this.state = {
      grid: grid,
      pathGenerators: [
        // Don't prune
        BacktrackingPathGenerator(grid, prefix => true),

        // Search for each word in the dictionary one-by-one
        DictionaryListPathGenerator(grid, dictionaryList),

        // Search for only words that have enough letters in the grid
        DictionaryListPathGenerator(grid, freqFilteredDictionaryList),

        // Search for only words that have plausible paths in the grid
        DictionaryListPathGenerator(grid, pathFilteredDictionaryList),

        // Prune by only allowing prefixes of words in the dictionary
        BacktrackingPathGenerator(grid,
          prefix => trie.hasWordWithPrefix(prefix)),

        // Prune by only allowing prefixes of words in the frequency filtered
        // dictionary
        BacktrackingPathGenerator(grid,
          prefix => freqFilteredTrie.hasWordWithPrefix(prefix)),

        // Prune by only allowing prefixes of words in the path filtered
        // dictionary
        BacktrackingPathGenerator(grid,
          prefix => pathFilteredTrie.hasWordWithPrefix(prefix)),
        /*
        */
      ]
    };
  }

  render() {
    const { grid, pathGenerators } = this.state;

    return <div className={css(styles.sideBySide)}>
      {pathGenerators.map((pathGenerator, i) => {
        return (
          <div className={css(styles.solverDisplay)} key={i}>
            <BoggleSolverDisplay
              isWord={s => !!trie.hasWord(s)}
              key={i}
              grid={grid}
              pathGenerator={pathGenerator}
              size={NUM_ROWS}
            />
          </div>
        );
      })}
    </div>
  }
};

const styles = StyleSheet.create({
  sideBySide: {
    margin: 50,
  }
});

