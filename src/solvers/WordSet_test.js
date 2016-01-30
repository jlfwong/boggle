import { assert } from 'chai';

import WordSet from './WordSet.js';

describe('WordSet', () => {
  it('can add words, check membership, and check for prefixes', () => {
    const wordSet = new WordSet();

    assert.isFalse(wordSet.has("a"));

    wordSet.add("a");
    assert.isTrue(wordSet.has("a"));

    wordSet.add("ab");
    assert.isTrue(wordSet.has("a"));
    assert.isTrue(wordSet.has("ab"));

    wordSet.add("ad");
    assert.isTrue(wordSet.has("a"));
    assert.isTrue(wordSet.has("ab"));
    assert.isTrue(wordSet.has("ad"));

    wordSet.add("boggle");
    wordSet.add("bog");
    assert.isTrue(wordSet.has("bog"));
    assert.isTrue(wordSet.has("boggle"));
    assert.isFalse(wordSet.has("bogg"));

    assert.isTrue(wordSet.hasWordWithPrefix("bogg"));
    assert.isFalse(wordSet.hasWordWithPrefix("boggles"));
    assert.isFalse(wordSet.hasWordWithPrefix("c"));
  });

  it('serializes when compressed', () => {
    const w1 = (
      new WordSet()
        .add("ab")
        .add("a")
        .add("dag"));

    assert.equal(JSON.stringify(w1), '{"a":{"b":1,"":1},"dag":1}');

    const w2 = (
      new WordSet()
        .add("abc")
        .add("abd"));
    // {a:{b:{c:1, d:1}}}
    // 
    // a -> b -> c
    //        \-> d
    assert.equal(JSON.stringify(w2), '{"ab":{"c":1,"d":1}}');
  });


  it('can be reconstructed', () => {
    const wordSet = new WordSet();
    wordSet.add("ab");
    wordSet.add("a");
    wordSet.add("dag");

    const wordSet2 = new WordSet(wordSet.toJSON());
    assert.isTrue(wordSet2.has("ab"));
    assert.isTrue(wordSet2.has("a"));
    assert.isTrue(wordSet2.has("dag"));
    assert.isFalse(wordSet2.has("b"));
  });
});
