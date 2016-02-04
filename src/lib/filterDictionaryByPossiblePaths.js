import getDynamicProgrammingTable from './getDynamicProgrammingTable.js';

/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  dictionary :: [word: String, ...]
 *
 * Returns a subsequence of dictionary containing only words
 * that contain a subset of the letters in grid in a sequence order, possibly
 * re-using tiles.
 */
const filterDictionaryByPossiblePaths = (grid, dictionary) => {
  return dictionary.filter(wordHasPossiblePathInGrid.bind(null, grid));
};

const wordHasPossiblePathInGrid = (grid, word) => {
  // d[i][r][c] is true if the first i+1 letters of word have a possible path
  // ending at [r][c] in grid.
  const d = getDynamicProgrammingTable(grid, word);

  const height = grid.length;
  const width = grid[0].length;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (d[word.length - 1][r][c]) {
        return true;
      }
    }
  }
  return false;
};


export default filterDictionaryByPossiblePaths;
