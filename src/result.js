import React from 'react';
import CONFIG from './config.js';
import Button from './button.js';
import './common.css';
import './result.css'

class Result extends React.Component {
    onClick() {
        this.props.history.push('/work/nothello')
    }

    render() {
        const playerId = this.props.location.state.playerId;
        const surrenderId = this.props.location.state.surrenderId;
        const squares = this.props.location.state.history.slice(-1)[0];
        const myColor = this.props.location.state.myColor;
        const result = calculateResult(playerId, surrenderId, squares, myColor);
    
        return (
            <div className="result">
                <div className="result__message">
                    <h1>{result}</h1>
                </div>
                <Button
                 className="result__button"
                 value="OK"
                 onClick={() => this.onClick()}
                />
            </div>
        );
    }
}

export default Result;

function calculateResult(playerId, surrenderId, squares, color) {
    const win  = 'You Win';
    const draw = 'Draw';
    const lose = 'You Lose';

    if(surrenderId) return playerId === surrenderId ? lose : win;

    const black = CONFIG.blackStone;
    const white = CONFIG.whiteStone;

    const count = getStoneCount(squares);

    if(count.black === count.white) return draw;

    let winner = (count.black > count.white) ? black : white;

    return winner === color ? win : lose;
}

function getStoneCount(squares) {
    const black = CONFIG.blackStone;
    const white = CONFIG.whiteStone;
    const count = { black: 0, white: 0 };

    for (let i = 0; i < squares.length; i++) {
        if(squares[i] === null) continue;
        if(squares[i] === black) count.black++;
        if(squares[i] === white) count.white++;
    }

    return count;
} 
