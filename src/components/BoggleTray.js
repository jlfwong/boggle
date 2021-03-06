import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PureComponent from 'react-pure-render/component';

import BoggleCube from './BoggleCube.js';

const RP = React.PropTypes;

const CUBE_WIDTH = 40;
const CUBE_SPACING = 5;

const LargeBoggleCube = BoggleCube('LargeBoggleCube', CUBE_WIDTH, CUBE_SPACING);

/**
 * An arrow between Boggle cubes.
 */
class BogglePathSegment extends PureComponent {
  static propTypes = {
    srcRow: RP.number.isRequired,
    srcCol: RP.number.isRequired,
    dstRow: RP.number.isRequired,
    dstCol: RP.number.isRequired,
    pathTracesWord: RP.bool.isRequired
  }

  render() {
    const { srcRow, srcCol, dstRow, dstCol, pathTracesWord } = this.props;

    const centerX = (srcCol) => ((srcCol + 1/2) * CUBE_WIDTH +
                                 (CUBE_SPACING * srcCol - 1));
    const centerY = centerX; // Same formula for now

    // The polygon listed below draws an arrow between (0, 0) and (0, 1). The
    // goal is to figure out an afine transformation that will transform the
    // line ((0, 0), (0, 1)) into the line joining the centers of the relevant
    // cells in the segment.

    // First, we scale the arrow. We want all of our arrows to be the same size.
    const scaleFactor = CUBE_WIDTH + CUBE_SPACING;
    const scaling = `scale(${scaleFactor}, ${scaleFactor})`;

    // We want all our arrows to be the same size, but the spacing between the
    // center of horizontal/vertically adjacent cells is less than the distance
    // between diagonally adjacent cells. To compensate, we translate the arrow
    // to the right a bit.
    const square = x => x * x;
    const compensationFactor = (
      Math.sqrt(square(centerX(dstCol) - centerX(srcCol)) +
                square(centerY(dstRow) - centerY(srcRow))) - scaleFactor
    ) / 2;
    const translation1 = `translate(${compensationFactor}, 0)`;

    // Next, we rotate the arrow (still at the origin) to point in the relative
    // direction of the src to the destination cell.
    // Since we're actually restricted to 8 possibilities, we could just
    // enumerate them, but let's do it the mathy way instead.
    const thetaRad = Math.atan2(dstRow - srcRow, dstCol - srcCol);
    const thetaDeg = thetaRad * (180 / Math.PI);
    const rotation = `rotate(${thetaDeg})`;

    // Finally, translate the arrow so that the origin of the arrow is the
    // center of the source boggle cube.
    const translateX = centerX(srcCol);
    const translateY = centerY(srcRow);
    const translation2 = `translate(${translateX}, ${translateY})`;

    const fillColor = pathTracesWord ? "#cfc" : "white";

    return (
      <g>
        <polygon
          transform={`${translation2} ${rotation} ${translation1} ${scaling}`}
          fill={fillColor}
          strokeWidth="0.015"
          stroke="black"
          points={`
            0.25,-0.05
            0.5,-0.05
            0.5,-0.1
            0.75,0
            0.5,0.1
            0.5,0.05
            0.25,0.05`} />
      </g>
    );
  }
}

class BogglePath extends PureComponent {
  static propTypes = {
    // List of coordinates to trace on the grid to show how a word was
    // discovered. e.g. [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2]].
    path: RP.arrayOf(RP.arrayOf(RP.number)).isRequired,

    // Number of rows in the Boggle grid
    nRows: RP.number.isRequired,

    // Number of columns in the Boggle grid
    nCols: RP.number.isRequired,

    // True if the path traces a complete word
    pathTracesWord: RP.bool.isRequired,
  };

  render() {
    const { path, nRows, nCols, pathTracesWord } = this.props;

    // Convert the coordinate list into a list of (source, destination) pairs
    // for each segment in the path.
    const segments = [];
    for (let i = 0; i < path.length - 1; i++) {
      segments.push([path[i], path[i + 1]]);
    }

    return (
      <svg
        height={CUBE_WIDTH * nRows + CUBE_SPACING * (nRows - 1)}
        width={CUBE_WIDTH * nCols + CUBE_SPACING * (nCols - 1)}
        className={css(styles.path)}
      >
        {segments.map(([[srcRow, srcCol], [dstRow, dstCol]]) => {
          return <BogglePathSegment
                    key={`${srcRow},${srcCol}:${dstRow},${dstCol}`}
                    srcRow={srcRow}
                    srcCol={srcCol}
                    dstRow={dstRow}
                    dstCol={dstCol}
                    pathTracesWord={pathTracesWord} />;
        })}
      </svg>
    );
  }
};

/**
 * Renders a tray of Boggle cubes, optionally including a path to trace on top
 * of them indicating where a word has been found or is being searched for.
 */
class BoggleTray extends PureComponent {
  static propTypes = {
    // 2D grid of letters
    grid: RP.arrayOf(RP.arrayOf(RP.string)).isRequired,

    // List of coordinates to trace on the grid to show how a word was
    // discovered. e.g. [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2]].
    path: RP.arrayOf(RP.arrayOf(RP.number.isRequired).isRequired).isRequired,

    // True if the path traces a full word.
    pathTracesWord: RP.bool.isRequired,
  }

  render() {
    const { grid, path, pathTracesWord } = this.props;

    const nRows = grid.length;
    const nCols = grid[0].length;

    const selectedCells = {};
    for (let [row, col] of path) {
      selectedCells[`${row},${col}`] = true;
    }

    let startCellKey = path.length > 0 && `${path[0][0]},${path[0][1]}`;
    let endCellKey = (path.length > 1 &&
                      `${path[path.length-1][0]},${path[path.length-1][1]}`);

    const position = (key) => {
      if (key === startCellKey) {
        return 'start';
      } else if (key == endCellKey) {
        return 'end';
      } else {
        return 'middle';
      }
    }

    return (
      <div className={css(styles.tray)} style={{
        width: CUBE_WIDTH * nCols + CUBE_SPACING * (nCols + 1),
        height: CUBE_WIDTH * nRows + CUBE_SPACING * (nRows + 1),
      }}>
        {grid.map((row, rowIndex) => {
          return (
            <div key={`${rowIndex}`} className={css(styles.row)}>
              {row.map((letter, colIndex) => {
                const key = `${rowIndex},${colIndex}`;
                return <LargeBoggleCube
                          key={key}
                          selected={!!selectedCells[key]}
                          position={position(key)}
                          letter={letter} />
              })}
            </div>
          )
        })}
        {path &&
          <BogglePath
            path={path}
            nRows={nRows}
            nCols={nCols}
            pathTracesWord={pathTracesWord}
          />}
      </div>
    );
  }
};

BoggleTray.CUBE_WIDTH = CUBE_WIDTH;
BoggleTray.CUBE_SPACING = CUBE_SPACING;

const styles = StyleSheet.create({
  path: {
    position: 'absolute',
    left: CUBE_SPACING,
    top: CUBE_SPACING,
    zIndex: 100,
  },
  row: {
    display: 'flex',
  },
  tray: {
    background: '#449',
    borderRadius: 10,
    padding: CUBE_SPACING / 2,
    boxSizing: 'border-box',
    position: 'relative',
  }
});

export default BoggleTray;
