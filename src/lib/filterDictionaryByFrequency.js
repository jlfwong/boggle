/**
 * Given
 *
 *  grid :: [[letter: String, ...], ...]
 *  dictionary :: [word: String, ...]
 *
 * Returns a subsequence of dictionary containing only words
 * that contain a subset of the letters in grid.
 */
const filterDictionaryByFrequency = (grid, dictionary) => {
  const gridFreq = freqCount(grid.map(row => row.join("")).join(""));

  return dictionary.filter(word => {
    return isFreqSubset(freqCount(word), gridFreq);
  });
};

// Return a map of letter to # of occurrences in word.
// e.g.
//  freqCount("apple") -> {"a": 1, "p": 2, "l": 1, "e": 1}
const freqCount = (word) => {
  const ret = {};
  for (let i = 0; i < word.length; i++) {
    const c = word[i].toUpperCase();
    ret[c] = (ret[c] || 0) + 1;
  }
  return ret;
};

// Returns true if all the frequencies in freq1 are less than or equal to the
// corresponding frequencies in freq2
const isFreqSubset = (freq1, freq2) => {
  for (let key of Object.keys(freq1)) {
    if (!freq2[key] || freq2[key] < freq1[key]) {
      return false;
    }
  }
  return true;
};

export default filterDictionaryByFrequency;
