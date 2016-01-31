import { assert } from 'chai';

import Trie from './Trie.ts';

describe('Trie', () => {
  it('can add words, check membership, and check for prefixes', () => {
    const trie = new Trie();

    assert.isFalse(trie.hasWord("a"));

    trie.add("a");
    assert.isTrue(trie.hasWord("a"));

    trie.add("ab");
    assert.isTrue(trie.hasWord("a"));
    assert.isTrue(trie.hasWord("ab"));

    trie.add("ad");
    assert.isTrue(trie.hasWord("a"));
    assert.isTrue(trie.hasWord("ab"));
    assert.isTrue(trie.hasWord("ad"));

    trie.add("boggle");
    trie.add("bog");
    assert.isTrue(trie.hasWord("bog"));
    assert.isTrue(trie.hasWord("boggle"));
    assert.isFalse(trie.hasWord("bogg"));

    assert.isTrue(trie.hasWordWithPrefix("bogg"));
    assert.isFalse(trie.hasWordWithPrefix("boggles"));
    assert.isFalse(trie.hasWordWithPrefix("c"));
  });
});
