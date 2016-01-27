import { assert } from 'chai';

import BruteForceSolver from './BruteForceSolver.js';

const generatorToArray = (generator) => {
  const ret = [];
  let next;
  while (!(next = generator.next()).done) {
    ret.push(next.value);
  }
  return ret;
};

describe("BruteForceSolver", () => {
  it("yields series of [path, candidateWord, wordIsInDictionary]", () => {
    const gen = BruteForceSolver(
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
      "a",
      "ab",
      "abc",
      "abcd",
      "abd",
      "abdc",
      "ac",
      "acb",
      "acbd",
      "acd",
      "acdb",
      "ad",
      "adb",
      "adbc",
      "adc",
      "adcb",
      "b",
      "ba",
      "bac",
      "bacd",
      "bad",
      "badc",
      "bc",
      "bca",
      "bcad",
      "bcd",
      "bcda",
      "bd",
      "bda",
      "bdac",
      "bdc",
      "bdca",
      "c",
      "ca",
      "cab",
      "cabd",
      "cad",
      "cadb",
      "cb",
      "cba",
      "cbad",
      "cbd",
      "cbda",
      "cd",
      "cda",
      "cdab",
      "cdb",
      "cdba",
      "d",
      "da",
      "dab",
      "dabc",
      "dac",
      "dacb",
      "db",
      "dba",
      "dbac",
      "dbc",
      "dbca",
      "dc",
      "dca",
      "dcab",
      "dcb",
      "dcba",
    ], results.map(x => x[1]));
  });
});
