import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PureComponent from 'react-pure-render/component';

const RP = React.PropTypes;

const BoggleCube = (name, CUBE_WIDTH, CUBE_SPACING) => {
  /**
   * Render a single boggle cube.
   */
  class _Cube extends PureComponent {
    static displayName = name

    static propTypes = {
      // The letter to display on the cube (will be 2 letters in the case of
      // 'Qu')
      letter: RP.string.isRequired,

      // True if the cube should display as "selected"
      selected: RP.bool,

      // True if the cube's border should display as "selected" if the cell is
      // selected.
      selectedBorder: RP.bool,

      position: RP.oneOf(["start", "middle", "end"]),
    }

    static defaultProps = {
      selected: false,
      selectedBorder: true,
      position: "middle"
    };

    render() {
      const {
        letter,
        partOfWord,
        position,
        selected,
        selectedBorder
      } = this.props;

      const cubeClassName = css(
        styles.cube,
        selected && selectedBorder && styles.cubeSelected
      );

      const cubeTextClassName = css(
        styles.cubeText,
        selected && styles.cubeTextSelected,
        {
          "start": styles.cubeTextStart,
          "end": styles.cubeTextEnd
        }[position]
      );

      return (
        <div className={cubeClassName}>
          <div className={css(styles.cubeInner)}>
            <div className={cubeTextClassName}>
              {letter}
            </div>
          </div>
        </div>
      );
    }
  };

  const styles = StyleSheet.create({
    cube: {
      width: CUBE_WIDTH,
      height: CUBE_WIDTH,
      boxSizing: 'border-box',
      borderRadius: CUBE_WIDTH / 5,
      background: ('linear-gradient(to bottom, rgba(255,250,232,1) 0%, ' +
                    'rgba(166,163,151,1) 100%)'),
      margin: CUBE_SPACING / 2,
      padding: 1,
      border: '1px solid #000',
    },
    cubeSelected: {
      border: '1px solid #fff',
    },
    cubePartOfWord: {
      border: '1px solid #cfc',
    },
    cubeInner: {
      borderRadius: CUBE_WIDTH / 2,
      width: CUBE_WIDTH - 4,
      height: CUBE_WIDTH - 4,
      boxShadow: '0 0 1px #E1DFCC',
      boxSizing: 'border-box',
      background: '#E1DFCC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial Bold, sans-serif'
    },
    cubeText: {
      color: 'black',
      fontSize: CUBE_WIDTH / 2.5,
    },
    cubeTextSelected: {
      color: 'white',
      textShadow: `
        -1px -1px 0 black,
        -1px  1px 0 black,
        1px -1px 0 black,
        1px  1px 0 black
      `,
    },
    cubeTextStart: {
      color: '#ccf',
    },
    cubeTextEnd: {
      color: '#fcc',
    },
  });

  return _Cube;
};

export default BoggleCube;
