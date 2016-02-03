import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PureComponent from 'react-pure-render/component';

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

class FoundWord extends PureComponent {
  static propTypes = {
    word: RP.string.isRequired,
    selected: RP.bool.isRequired,
  };

  render() {
    const { word, selected } = this.props;

    return <div className={css(styles.foundWord)}>
      {word.split('').map((c, i) => {
        return <SmallBoggleCube
          key={i}
          letter={c}
          selected={selected}
          selectedBorder={false}
        />;
      })}
    </div>;
  }
};

/**
 * Renders the progress of an animated solving
 * of a Boggle game.
 */
class BoggleSolverDisplay extends PureComponent {
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
      speed: 1,
    }
  }

  tick() {
    const { pathGenerator, isWord } = this.props;
    const { speed } = this.state;

    let nextState;
    let next;
    let curState = this.state;

    for (let i = 0; i < speed; i++) {
      next = pathGenerator.next();
      if (!next.done) {
        const [path, candidateWord] = next.value;
        const wordIsInDictionary = isWord(candidateWord);

        nextState = {
          ...curState,
          path: path,
          pathTracesWord: wordIsInDictionary
        }
        if (wordIsInDictionary) {
          // Some traversal methods end up traversing the same path multiple times.
          // We're only interested in unique words though, so ignore the rest.
          const pathKey = path.map(([r, c]) => `${r},${c}`).join("|");

          if (!curState.foundPaths[pathKey]) {
            const wordCount = (curState.wordCounts[candidateWord] || 0) + 1;

            nextState.foundWords = [[candidateWord, path, wordCount]].concat(
                                        curState.foundWords);
            nextState.wordCounts = {
              ...curState.wordCounts,
              [candidateWord]: wordCount
            };

            nextState.foundPaths = {
              ...curState.foundPaths,
              [pathKey]: true
            };
          };
        }
        curState = nextState;
      } else {
        this.setState({
          path: [],
          pathTracesWord: false
        });
        return;
      }
    }
    this.setState(curState);
    this.frameRequest = requestAnimationFrame(this.tick);
  }

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
    }
  }

  handleWordMouseEnter(path) {
    if (this.frameRequest) {
      cancelAnimationFrame(this.frameRequest);
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
                  onMouseEnter={this.handleWordMouseEnter.bind(this, wordPath)}
                  onMouseLeave={this.handleWordMouseLeave.bind(this)}
                >
                  <FoundWord word={word} selected={selected} />
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
