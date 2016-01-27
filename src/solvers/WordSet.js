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
    this.root = decompressTrie(data);
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
    node[''] = 1;
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
    return node[''] === 1;
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
    return compressTrie(this.root);
  }
};

const compressTrie = (node) => {
  if (node === 1) {
    return node;
  }

  const ret = {};
  for (let [key, child] of Object.entries(node)) {
    if (child === 1) {
      ret[key] = 1;
    }

    child = compressTrie(child);

    const childKeys = Object.keys(child);
    if (childKeys.length === 1 && child[childKeys[0]] === 1) {
      ret[key + childKeys[0]] = 1;
    } else {
      ret[key] = child;
    }
  };

  return ret;
};

const decompressTrie = (node) => {
  if (node === 1) {
    return 1;
  }

  const ret = {};
  for (let [key, child] of Object.entries(node)) {
    if (child === 1 && key !== '') {
      let cur = ret;
      for (var i = 0; i < key.length; i++) {
        cur[key[i]] = {};
        cur = cur[key[i]];
      }
      cur[''] = 1;
    } else {
      ret[key] = decompressTrie(child);
    }
  };
  return ret;
};

export default WordSet;
