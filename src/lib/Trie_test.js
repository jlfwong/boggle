import { assert } from 'chai';

import Trie from './Trie.js';

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

  it('serializes when compressed', () => {
    const w1 = (
      new Trie()
        .add("ab")
        .add("a")
        .add("dag"));

    assert.equal(JSON.stringify(w1), '{"A":{"B":1,"":1},"DAG":1}');

    const w2 = (
      new Trie()
        .add("abc")
        .add("abd"));
    // {a:{b:{c:1, d:1}}}
    // 
    // a -> b -> c
    //        \-> d
    assert.equal(JSON.stringify(w2), '{"AB":{"C":1,"D":1}}');
  });


  it('can be reconstructed', () => {
    const trie = new Trie();
    trie.add("ab");
    trie.add("a");
    trie.add("dag");

    const trie2 = new Trie(trie.toJSON());
    assert.isTrue(trie2.hasWord("ab"));
    assert.isTrue(trie2.hasWord("a"));
    assert.isTrue(trie2.hasWord("dag"));
    assert.isFalse(trie2.hasWord("b"));
  });
});
