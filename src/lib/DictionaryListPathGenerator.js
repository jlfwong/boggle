import BacktrackingPathGenerator from './BacktrackingPathGenerator.ts';

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
 */
const DictionaryListPathGenerator = function*(grid, dictionary) {
  // DFS for each word in the list individually.
  for (let word of dictionary) {
    yield* BacktrackingPathGenerator(grid,
            prefix => word.indexOf(prefix) === 0);
  }
};

export default DictionaryListPathGenerator;
