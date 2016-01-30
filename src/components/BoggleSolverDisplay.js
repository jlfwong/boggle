import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BoggleTray from './BoggleTray.js';

const RP = React.PropTypes;

const scoreForWord = (word) => {
  const length = word.length;
  if (length < 5) return 1;
  if (length === 5) return 2;
  if (length === 6) return 3;
  if (length === 7) return 5;
  if (length === 8) return 11;
};

/**
 * Renders the progress of an animated solving
 * of a Boggle game.
 */
class BoggleSolverDisplay extends Component {
  static propTypes = {
    // 2D grid of letters
    grid: RP.arrayOf(RP.arrayOf(RP.string)).isRequired,

    solver: RP.object.isRequired
  };

  constructor(props) {
    super();

    this.tick = this.tick.bind(this);

    this.state = {
      path: [],
      pathTracesWord: false,
      foundWords: [],
      wordCounts: {}
    }
  }

  tick() {
    const { solver } = this.props;

    const next = solver.next();
    if (!next.done) {
      const [path, candidateWord, wordIsInDictionary] = next.value;

      const nextState = {
        path: path,
        pathTracesWord: wordIsInDictionary
      }
      if (wordIsInDictionary) {
        // If the word is in the dictionary, pause 300ms per letter in the word
        this.timeout = setTimeout(this.tick, 100 * candidateWord.length);

        const wordCount = (this.state.wordCounts[candidateWord] || 0) + 1;

        nextState.foundWords = [[candidateWord, path, wordCount]].concat(
                                    this.state.foundWords);
        nextState.wordCounts = {
          ...this.state.wordCounts,
          [candidateWord]: wordCount
        };
      } else {
        this.timeout = setTimeout(this.tick, 50);
      }
      this.setState(nextState);
    } else {
      this.setState({
        path: [],
        pathTracesWord: false
      });
    }
  }

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  handleWordMouseEnter(path) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.setState({
      path: path,
      pathTracesWord: true
    });
  }

  handleWordMouseLeave() {
    this.tick();
  }

  render() {
    const { grid } = this.props;
    const { path, pathTracesWord, foundWords } = this.state;

    const score = foundWords.reduce((accum, [word, ...rest]) => {
      return accum + scoreForWord(word)
    }, 0);

    return (
      <div>
        <BoggleTray
          grid={grid}
          path={path}
          pathTracesWord={pathTracesWord} />

        <div>
          {`${score} points with ${foundWords.length} ` +
           `word${foundWords.length != 2 ? 's' : ''}`}
        </div>

        <ul className={css(styles.foundWordBox)}>
          {foundWords.map(([word, path, num]) => {
            const text = word + (num > 1 ? ` (${num})` : '');
            return (
              <li
                key={text}
                className={css(styles.foundWord)}
              >
                <a
                  href="javascript:void 0"
                  onMouseEnter={this.handleWordMouseEnter.bind(this, path)}
                  onMouseLeave={this.handleWordMouseLeave.bind(this)}
                >
                  {text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  foundWordBox: {
    height: 100,
    width: 185,
    overflow: 'scroll'
  }
});

export default BoggleSolverDisplay;
