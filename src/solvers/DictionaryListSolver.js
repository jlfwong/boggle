import TreePruningSolver from './TreePruningSolver.js';

/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  dictionary :: [word: String, ...]
 *
 * Yields
 *
 *  [path, candidateWord, wordIsInDictionary]
 *
 * Where
 *
 *  path :: [[row: Number, col: Number], ...]
 *  candidateWord: String
 *  wordIsInDictionary: Boolean
 */
const DictionaryListSolver = function*(grid, dictionary) {
  // DFS for each word in the list individually.
  for (let word of dictionary) {
    yield* TreePruningSolver(grid,
            prefix => prefix === word,
            prefix => word.indexOf(prefix) === 0);
  }
};

export default DictionaryListSolver;
