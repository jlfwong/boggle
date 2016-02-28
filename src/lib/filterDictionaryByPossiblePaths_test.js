import { assert } from 'chai';

import filterDictionaryByPossiblePaths from './filterDictionaryByPossiblePaths.js';

describe("filterDictionaryByPossiblePaths", () => {
  it("removes words without sufficient letters in the grid", () => {
    assert.deepEqual([
      "a",
    ],
    filterDictionaryByPossiblePaths([
      ["a"],
    ], [
      "a",
      "b"
    ]));

    assert.deepEqual([
      "a",
      "ab",
      "bc",
    ],
    filterDictionaryByPossiblePaths([
      ["a", "b", "c"],
    ], [
      "a",
      "ab",
      "bc",
      "ac",
    ]));

    assert.deepEqual([
      "QUO",
    ],
    filterDictionaryByPossiblePaths([
      ["Qu", "O"]
    ], [
      "QUO"
    ]));
  });
});
