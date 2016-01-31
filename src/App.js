import "babel-polyfill";

import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BoggleSolverDisplay from './components/BoggleSolverDisplay.js';
import BacktrackingPathGenerator from './lib/BacktrackingPathGenerator.ts';
import DictionaryListPathGenerator from './lib/DictionaryListPathGenerator.js';
import Trie from './lib/Trie.ts';

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

// Return a map of letter to # of occurrences in word.
// e.g.
//  freqCount("apple") -> {"a": 1, "p": 2, "l": 1, "e": 1}
const freqCount = (word) => {
  const ret = {};
  for (let i = 0; i < word.length; i++) {
    const c = word[i].toUpperCase();
    ret[c] = (ret[c] || 0) + 1;
  }
  return ret;
};

// Returns true if all the frequencies in freq1 are less than or equal to the
// corresponding frequencies in freq2
const isFreqSubset = (freq1, freq2) => {
  for (let key of Object.keys(freq1)) {
    if (!freq2[key] || freq2[key] < freq1[key]) {
      return false;
    }
  }
  return true;
};

const dictionaryList = dict.split(/\s+/);
const trie = new Trie(dictionaryList);

export class App extends Component {
  constructor(props) {
    super();

    const grid = randomGrid();

    const gridFreq = freqCount(grid.join(""));

    const freqFilteredDictionaryList = dictionaryList.filter(word => {
      return isFreqSubset(freqCount(word), gridFreq);
    });

    const freqFilteredTrie = new Trie(freqFilteredDictionaryList);

    this.state = {
      grid: grid,
      pathGenerators: [
        // Don't prune
        BacktrackingPathGenerator(grid, prefix => true),

        // Search for each word in the dictionary one-by-one
        DictionaryListPathGenerator(grid, dictionaryList),

        // Search for only words that have enough letters in the grid
        DictionaryListPathGenerator(grid, freqFilteredDictionaryList),

        // Prune by only allowing prefixes of words in the dictionary
        BacktrackingPathGenerator(grid,
          prefix => trie.hasWordWithPrefix(prefix)),

        // Prune by only allowing prefixes of words in the frequency filtered
        // dictionary
        BacktrackingPathGenerator(grid,
          prefix => freqFilteredTrie.hasWordWithPrefix(prefix)),
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
              pathGenerator={pathGenerator} />
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
    width: 50 * NUM_COLS,
  }
});
