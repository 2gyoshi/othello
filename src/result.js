import React from 'react';
import CONFIG from './config.js';
import Stone from './stone.js';

export default function Result(props) {
    const player1 = props.player;
    const player2 = props.opponent;
    const squares = props.history.slice(-1)[0];
    const result = calculateResult(squares, player1);

    return (
        <div className="result">
            <div className="result__message">
                {result}
            </div>
            <div className="result__description">
                <div className={`result__${player1}`}>
                        <span className="result__name">Player1</span>
                        <Stone value={player1} />
                        <span className="result__count">{`x${props.count[player1]}`}</span>
                </div>
                <div className={`result__${player2}`}>
                        <span className="result__name">Player2</span>
                        <Stone value={player2} />
                        <span className="result__count">{`x${props.count[player2]}`}</span>
                </div>
            </div>
            <button className="result__button" onClick={() => window.location.reload()}>OK</button>
        </div>
    );
}

function calculateResult(squares, color) {
    const black = CONFIG.blackStone;
    const white = CONFIG.whiteStone;

    const stoneCount = getStoneCount(squares);

    if(stoneCount.black === stoneCount.white) return 'Draw';

    let winner = (stoneCount.black > stoneCount.white) ? black : white;

    return winner === color ? 'You Win' : 'You Lose';
}

function getStoneCount(squares, stone) {
    const blackStone = CONFIG.blackStone;
    const whiteStone = CONFIG.whiteStone;
    let blackStoneCount = 0;
    let whiteStoneCount = 0;
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] === null) continue;
        if(squares[i] === blackStone) blackStoneCount++;
        if(squares[i] === whiteStone) whiteStoneCount++;
    }

    const count = {
        black: blackStoneCount,
        white: whiteStoneCount
    };

    if(!stone) {
        return count;
    }

    return count[stone];
} 
