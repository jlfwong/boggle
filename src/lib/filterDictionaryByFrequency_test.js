import { assert } from 'chai';

import filterDictionaryByFrequency from './filterDictionaryByFrequency.js';

describe("filterDictionaryByFrequency", () => {
  it("removes words without sufficient letters in the grid", () => {
    assert.deepEqual(filterDictionaryByFrequency([
      [["a", "b"],
       ["b", "c"]]
    ], [
      "a",
      "ab",
      "abb",
      "bab",
      "cab",
      "dab",
      "aa"
    ]), [
      "a",
      "ab",
      "abb",
      "bab",
      "cab"
    ]);
  });
});
