import DepthFirstTraversal from './DepthFirstTraversal.js';

/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  dictionary :: [word: String, ...]
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
const DictionaryListTraversal = function*(grid, dictionary) {
  // DFS for each word in the list individually.
  for (let word of dictionary) {
    yield* DepthFirstTraversal(grid,
            prefix => word.indexOf(prefix) === 0);
  }
};

export default DictionaryListTraversal;
