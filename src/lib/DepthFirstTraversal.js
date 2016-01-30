/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  prefixIsWord :: (prefix) => bool
 *  prefixIsValid :: (prefix) => bool
 *
 * Yields
 *
 *  [path, nextPrefix]
 *
 * Where
 *
 *  path :: [[row: Number, col: Number], ...]
 *  nextPrefix: String
 *  wordIsInDictionary: Boolean
 */
const DepthFirstTraversal = function*(grid, prefixIsValid) {
    const height = grid.length;
    const width = grid[0].length;

    for (var startR = 0; startR < height; startR++) {
      for (var startC = 0; startC < width; startC++) {
        const frontier = [
          {
            path: [[startR, startC]],
            seen: {},
            prefix: "",
          }
        ];

        while (frontier.length > 0) {
          const {path, seen, prefix} = frontier.pop();
          const [endR, endC] = path[path.length - 1];

          // Last cube is out of bounds
          if (endR < 0 || endR >= height || endC < 0 || endC >= width) {
            continue;
          }

          // Already used this cube!
          if (seen[`${endR},${endC}`]) {
            continue;
          }

          const nextPrefix = prefix + grid[endR][endC].toUpperCase();

          if (!prefixIsValid(nextPrefix)) {
            continue;
          };

          yield [path, nextPrefix];

          const nextSeen = {
            ...seen,
            [`${endR},${endC}`]: true
          };

          for (var dR = 1; dR >= -1; dR--) {
            for (var dC = 1; dC >= -1; dC--) {
              if (dR === 0 && dC === 0) {
                continue;
              }
              const nextR = endR + dR;
              const nextC = endC + dC;
              frontier.push({
                path: [...path, [nextR, nextC]],
                seen: nextSeen,
                prefix: nextPrefix
              });
            }
          }
        };
      }
    }
};

export default DepthFirstTraversal;
