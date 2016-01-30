import { assert } from 'chai';

import TreePruningSolver from './TreePruningSolver.js';
import Trie from './Trie.js';

const generatorToArray = (generator) => {
  const ret = [];
  let next;
  while (!(next = generator.next()).done) {
    ret.push(next.value);
  }
  return ret;
};

describe("TreePruningSolver", () => {
  it("yields series of [path, candidateWord, wordIsInDictionary]", () => {
    const trie = new Trie().add("bad").add("cab");

    const gen = TreePruningSolver(
      [["a", "b"],
       ["c", "d"]],
      prefix => trie.hasWord(prefix),
      prefix => trie.hasWordWithPrefix(prefix),
    );

    const results = generatorToArray(gen);

    assert.deepEqual([
      "b",
      "ba",
      "bad",
      "c",
      "ca",
      "cab",
    ], results.map(x => x[1]));

    assert.deepEqual([
      "bad",
      "cab"
    ], results.filter(x => x[2]).map(x => x[1]));

    assert.deepEqual([
      "b",
      "ba",
      "bad",
      "c",
      "ca",
      "cab",
    ], results.map(x => x[1]));
  });
});
