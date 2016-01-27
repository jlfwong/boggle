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

  it('can be serialized', () => {
    const wordSet = new WordSet();
    wordSet.add("ab");
    wordSet.add("a");

    assert.equal(JSON.stringify(wordSet), '{"a":{"b":{"$":1},"$":1}}');
  });

  it('can be reconstructed', () => {
    const wordSet = new WordSet();
    wordSet.add("ab");
    wordSet.add("a");

    const wordSet2 = new WordSet(wordSet.toJSON());
    assert.isTrue(wordSet.has("ab"));
    assert.isTrue(wordSet.has("a"));
    assert.isFalse(wordSet.has("b"));
  });
});
