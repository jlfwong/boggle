import React, { Component } from 'react';

const CUBE_WIDTH = 40;
const CUBE_SPACING = 5;

class BoggleCube extends Component {
  render() {
    const { letter } = this.props;

    return (
      <div style={{
        width: CUBE_WIDTH,
        height: CUBE_WIDTH,
        boxSizing: 'border-box',
        border: '1px solid #999',
        borderRadius: 7,
        background: ('linear-gradient(to bottom, rgba(255,250,232,1) 0%, ' +
                     'rgba(166,163,151,1) 100%)'),
        margin: CUBE_SPACING / 2,
        padding: 1,
        float: 'left'
      }}>
        <div style={{
          borderRadius: CUBE_WIDTH / 2,
          width: CUBE_WIDTH - 4,
          height: CUBE_WIDTH - 4,
          boxShadow: '0 0 1px #E1DFCC',
          boxSizing: 'border-box',
          background: '#E1DFCC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial Bold, sans-serif',
          fontWeight: 'bolder'
        }}>
          {letter}
        </div>
      </div>
    );
  }
};

class BoggleTray extends Component {
  render() {
    const { grid } = this.props;

    return (
      <div style={{
        background: '#444',
        borderRadius: 10,
        width: CUBE_WIDTH * 4 + CUBE_SPACING * 5,
        height: CUBE_WIDTH * 4 + CUBE_SPACING * 5,
        padding: CUBE_SPACING / 2,
        boxSizing: 'border-box'
      }}>
        {grid.map((row, rowIndex) => (
          <div key={`${rowIndex}`} style={{clear: 'both'}}>
            {row.map((letter, colIndex) => (
              <BoggleCube key={`${rowIndex},${colIndex}`} letter={letter} />
            ))}
          </div>
        ))}
      </div>
    );
  }
};

export class App extends Component {
  render() {
    const grid = [
      ['A', 'B', 'C', 'D'],
      ['E', 'F', 'G', 'H'],
      ['I', 'J', 'K', 'L'],
      ['M', 'N', 'O', 'Qu']
    ];

    return (
      <div style={{margin: 50}}>
        <BoggleTray grid={grid} />
      </div>
    );
  }
};
