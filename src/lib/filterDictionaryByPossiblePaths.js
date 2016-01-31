/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  dictionary :: [word: String, ...]
 *
 * Returns a subsequence of dictionary containing only words
 * that contain a subset of the letters in grid in a sequence order, possibly
 * re-using tiles.
 *
 * Inspired by
 * http://exceptional-code.blogspot.com/2012/02/solving-boggle-game-recursion-prefix.html
 */
const filterDictionaryByPossiblePaths = (grid, dictionary) => {
  return dictionary.filter(wordHasPossiblePathInGrid.bind(null, grid));
};

const wordHasPossiblePathInGrid = (grid, word) => {
  // d[i][r][c] is true if the first i+1 letters of word have a possible path
  // ending at [r][c] in grid.
  const d = [];

  const height = grid.length;
  const width = grid[0].length;

  for (let i = 0; i < word.length; i++) {
    let dLayer = [];
    for (let r = 0; r < height; r++) {
      let dRow = [];
      for (let c = 0; c < width; c++) {
        let dCell = false;

        if (grid[r][c] === word[i]) {
          if (i === 0) {
            dCell = true;
          } else {
            // We can make a possible path of that traces the i + 1 letter
            // prefix of word which ends at (r, c) if there exists a possible
            // path that traces the i letter prefix of word ending in one of the
            // cells adjacent to (r, c).
            for (let adjR = r - 1; adjR <= r + 1 && !dCell; adjR++) {
              for (let adjC = c - 1; adjC <= c + 1 && !dCell; adjC++) {
                if (adjR === r && adjC === c) {
                  continue;
                }
                if (adjR < 0 || adjR >= height || adjC < 0 || adjC >= width) {
                  continue;
                }
                if (d[i-1][adjR][adjC]) {
                  dCell = true;
                }
              }
            }
          }
        }

        if (dCell && i === word.length - 1) {
          return true;
        }

        dRow.push(dCell);
      }
      dLayer.push(dRow);
    }
    d.push(dLayer);
  }
  return false;
};


export default filterDictionaryByPossiblePaths;
