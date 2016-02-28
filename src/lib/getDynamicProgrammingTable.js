/**
 * Return a three dimensional array, d, where
 * d[i-1][r][c] is true iff the first i letters of word have a path
 * ending at [r][c] in grid, possibly reusing tiles.
 *
 * Inspired by
 * http://exceptional-code.blogspot.com/2012/02/solving-boggle-game-recursion-prefix.html
 */
const getDynamicProgrammingTable = (grid, word) => {
  // The fact that "Qu" is a single tile somewhat complicates matters, so we'll
  // only compare the first letter of each tile, and we'll replace sequences
  // of "QU" in the word with just "Q". This is safe because all words in the
  // dictionary starting with a "Q" also start with "QU" (e.g. "QI" is not in
  // the dictionary).
  word = word.replace("QU", "Q");

  const d = [];

  const height = grid.length;
  const width = grid[0].length;

  for (let i = 0; i < word.length; i++) {
    let dLayer = [];
    for (let r = 0; r < height; r++) {
      let dRow = [];
      for (let c = 0; c < width; c++) {
        let dCell = false;

        if (grid[r][c][0] === word[i]) {
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
        dRow.push(dCell);
      }
      dLayer.push(dRow);
    }
    d.push(dLayer);
  }

  return d;
};

export default getDynamicProgrammingTable;
