import React from 'react';
import Square from './square.js';
import Stone from './stone.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";


class Board extends React.Component {
    renderStone(i) {
        if(this.props.enableSquares.includes(i) === true) {
            return <div className="enable"/>
        }

        if(this.props.squares[i] === 'block') {
            return <FontAwesomeIcon className="block" icon={faTimesCircle} />
        }

        if(this.props.squares[i] === null) return null;

        return (
            <Stone className={`stone ${this.props.squares[i]}`} />
        );
    }

    renderSquare(i) {
        const child = this.renderStone(i);
        return (
            <Square key={i} className="square" onClick={() => this.props.onClick(i)}>
                {child}
            </Square>
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
                </div>

                {list}
            </div>
        );
    }
}

export default Board;