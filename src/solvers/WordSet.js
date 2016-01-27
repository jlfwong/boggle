/**
 * A set of words using much less memory than an object literal with all words
 * as keys.
 *
 * Implemented as a Trie.
 */

// WordSet :: Node
// Node :: LeafNode | InternalNode
// LeafNode :: 1
// InternalNode :: {[key: String]: Node}

class WordSet {
  constructor(data = {}) {
    this.root = data;
  }

  add(word) {
    let matchedLength = 0;
    let node = this.root;

    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      if (!node[c]) {
        node[c] = {};
      }
      node = node[c];
    }
    node['$'] = 1;
  }

  has(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      if (!node[c]) {
        return false;
      }
      node = node[c];
    }
    return node['$'] === 1;
  }

  hasWordWithPrefix(prefix) {
    let node = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const c = prefix[i];
      if (!node[c]) {
        return false;
      }
      node = node[c];
    }
    return true;
  }

  toJSON() {
    return this.root;
  }
}

export default WordSet;
