import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';

import BoggleTray from './BoggleTray.js';
import BoggleCube from './BoggleCube.js';

const SmallBoggleCube = BoggleCube('SmallBoggleCube', 30, 2);

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

    pathGenerator: RP.object.isRequired,

    isWord: RP.func.isRequired,

    size: RP.number.isRequired,
  };

  constructor(props) {
    super();

    this.tick = this.tick.bind(this);

    this.state = {
      path: [],
      pathTracesWord: false,
      foundPaths: {},
      foundWords: [],
      wordCounts: {},
      hovering: false,
    }
  }

  tick() {
    const { pathGenerator, isWord } = this.props;

    const next = pathGenerator.next();
    if (!next.done) {
      const [path, candidateWord] = next.value;
      const wordIsInDictionary = isWord(candidateWord);

      const nextState = {
        path: path,
        pathTracesWord: wordIsInDictionary
      }
      if (wordIsInDictionary) {
        // Some traversal methods end up traversing the same path multiple times.
        // We're only interested in unique words though, so ignore the rest.
        const pathKey = path.map(([r, c]) => `${r},${c}`).join("|");

        if (!this.state.foundPaths[pathKey]) {
          const wordCount = (this.state.wordCounts[candidateWord] || 0) + 1;

          nextState.foundWords = [[candidateWord, path, wordCount]].concat(
                                      this.state.foundWords);
          nextState.wordCounts = {
            ...this.state.wordCounts,
            [candidateWord]: wordCount
          };

          nextState.foundPaths = {
            ...this.state.foundPaths,
            [pathKey]: true
          };
        };

        this.timeout = setTimeout(this.tick, 50);
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
      pathTracesWord: true,
      hovering: true,
    });
  }

  handleWordMouseLeave() {
    this.setState({hovering: false});
    this.tick();
  }

  render() {
    const { grid, size } = this.props;
    const { path, pathTracesWord, foundWords, hovering } = this.state;

    const height = (BoggleTray.CUBE_WIDTH * size +
                    BoggleTray.CUBE_SPACING * (size + 1));

    return (
      <div className={css(styles.container)}>
        <div className={css(styles.trayContainer)}>
          <BoggleTray
            grid={grid}
            path={path}
            pathTracesWord={pathTracesWord} />
        </div>

        <div className={css(styles.rightColumn)} style={{height}}>
          <div className={css(styles.wordCounter)}>
            {`Words Found: ${foundWords.length} `}
          </div>

          <ul className={css(styles.foundWordBox)}>
            {foundWords.map(([word, wordPath, num]) => {
              const key = word + (num > 1 ? ` (${num})` : '');

              const selected = hovering && (path === wordPath);

              return (
                <li
                  key={key}
                  className={css(styles.foundWord)}
                  onMouseEnter={this.handleWordMouseEnter.bind(this, wordPath)}
                  onMouseLeave={this.handleWordMouseLeave.bind(this)}
                >
                  {word.split('').map((c, i) => {
                    return <SmallBoggleCube
                      key={i}
                      letter={c}
                      selected={selected}
                      selectedBorder={false}
                    />;
                  })}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Helvetica',
    fontVariant: 'small-caps',
  },
  trayContainer: {
    float: 'left'
  },
  wordCounter: {
    marginBottom: 10,
    textDecoration: 'underline'
  },
  rightColumn: {
    marginLeft: 10,
    width: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  foundWord: {
    display: 'flex',
  },
  foundWordBox: {
    overflow: 'scroll',
  },
});

export default BoggleSolverDisplay;
