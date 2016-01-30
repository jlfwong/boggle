require("babel/register");

const fs = require("fs");

const Trie = require("./src/solvers/Trie.js");

const dict = fs.readFileSync(`${__dirname}/dict.txt`, 'utf-8').split('\n');

const trie = new Trie();

for (let word of dict) {
  word = word.trim();
  if (word.length > 0) {
    trie.add(word);
  }
}

console.log(JSON.stringify(trie));
