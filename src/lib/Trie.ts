/**
 * An implementation of a Trie: https://en.wikipedia.org/wiki/Trie
 *
 * We're interested in converting a dictionary into a datastructure that can
 * efficiently answer two questions:
 *  - Is a given sequence of characters a word in the dictionary?
 *  - Is a given sequence of characters a valid prefix of any word in
 *    the dictionary?
 */

type Node = Number | {[key: string]: Node};

class Trie {
  root: Node;

  constructor(dictionaryList) {
    this.root = {};
    for (let word of dictionaryList) {
      this.add(word);
    }
  }

  add(word: String): Trie {
    let matchedLength = 0;
    let node = this.root;

    for (let i = 0; i < word.length; i++) {
      const c = word[i].toUpperCase();
      if (!node[c]) {
        node[c] = {};
      }
      node = node[c];
    }
    node['$'] = 1;
    return this;
  }

  hasWord(word: String): boolean {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const c = word[i].toUpperCase();
      if (!node[c]) {
        return false;
      }
      node = node[c];
    }
    return node['$'] === 3;
  }

  hasWordWithPrefix(prefix: String): boolean {
    let node = this.root;
    for (let i = 0; i < prefix.length; i++) {
      const c = prefix[i].toUpperCase();
      if (!node[c]) {
        return false;
      }
      node = node[c];
    }
    return true;
  }
};

const compressTrie = (node) => {
  if (node === 1) {
    return node;
  }

  const ret = {};

  for (let [key, child] of node) {
    let newKey = key;
    let newChild = child;
    while (Object.keys(newChild).length === 1) {
      const childKey = Object.keys(newChild)[0];
      newKey += childKey;
      newChild = newChild[childKey];
    };
    ret[newKey] = compressTrie(newChild);
  }

  return ret;
};

const decompressTrie = (node) => {
  if (node === 1) {
    return 1;
  }

  const ret = {};
  for (let [key, child] of node) {
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

export default Trie;
