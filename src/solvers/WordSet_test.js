import { assert } from 'chai';

import WordSet from './WordSet.js';

describe('WordSet', () => {
  it('can add words and check membership', () => {
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
  });
});
