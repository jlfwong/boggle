import React, { Component } from 'react';

import BoggleTray from './BoggleTray.js';

const RP = React.PropTypes;

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
      pathTracesWord: false
    }
  }

  tick() {
    const { solver } = this.props;

    const next = solver.next();
    if (!next.done) {
      const [path, candidateWord, wordIsInDictionary] = next.value;

      this.setState({
        path: path,
        pathTracesWord: wordIsInDictionary
      });
      if (wordIsInDictionary) {
        // If the word is in the dictionary, pause 300ms per letter in the word
        this.timeout = setTimeout(this.tick, 300 * candidateWord.length);
      } else {
        this.timeout = setTimeout(this.tick, 100);
      }
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

  render() {
    const { grid } = this.props;
    const { path, pathTracesWord } = this.state;

    return (
      <div style={{margin: 50}}>
        <BoggleTray
          grid={grid}
          path={path}
          pathTracesWord={pathTracesWord} />
      </div>
    );
  }
}

export default BoggleSolverDisplay;
