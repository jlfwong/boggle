import { assert } from 'chai';

import BacktrackingPathGenerator from './BacktrackingPathGenerator.js';
import Trie from './Trie.js';

const generatorToArray = (generator) => {
  const ret = [];
  let next;
  while (!(next = generator.next()).done) {
    ret.push(next.value);
  }
  return ret;
};

describe("BacktrackingPathGenerator", () => {
  it("yields series of [path, candidateWord, wordIsInDictionary]", () => {
    const trie = new Trie().add("bad").add("cab");

    const gen = BacktrackingPathGenerator(
      [["a", "b"],
       ["c", "d"]],
      prefix => trie.hasWordWithPrefix(prefix),
    );

    const results = generatorToArray(gen);

    assert.deepEqual([
      "B",
      "BA",
      "BAD",
      "C",
      "CA",
      "CAB",
    ], results.map(x => x[1]));
  });
});
