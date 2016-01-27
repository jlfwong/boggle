require("babel/register");

const fs = require("fs");

const WordSet = require("./src/solvers/WordSet.js");

const dict = fs.readFileSync(`${__dirname}/dict.txt`, 'utf-8').split('\n');

const wordSet = new WordSet();

for (let word of dict) {
  word = word.trim();
  if (word.length > 0) {
    wordSet.add(word);
  }
}

console.log(JSON.stringify(wordSet));
