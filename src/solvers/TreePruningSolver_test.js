import { assert } from 'chai';

import TreePruningSolver from './TreePruningSolver.js';

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
    const gen = TreePruningSolver(
      [["a", "b"],
       ["c", "d"]],
      ["bad", "cab"]
    );

    const results = generatorToArray(gen);

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
