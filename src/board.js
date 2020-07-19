import React from 'react';
import Square from './square.js';

export default class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
             value={this.props.squares[i]}
             onClick={() => this.props.onClick(i)}
             enable={this.props.enableSquares.includes(i) ? 'enable' : ''}
             key={i}
            />
        );
    }

    render() {
        const list = [];
        for (let i = 0; i < 64; i++) {
            list.push(this.renderSquare(i));
        }

        return (

            <div className="board">
                <div className="board-mark">
                    <div className="mark lt"/>
                    <div className="mark lb"/>
                    <div className="mark rt"/>
                    <div className="mark rb"/>
                    <div/>
                </div>

                {list}
            </div>
        );
    }
}
