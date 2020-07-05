import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={`square ${props.value}`} onClick={props.onClick} />
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
             value={this.props.squares[i]}
             onClick={() => this.props.onClick(i)}
             key={i}
            />
        );
    }

    render() {
        const list = new Array();
        for (let i = 0; i < 64; i++) {
            list.push(this.renderSquare(i));
        }

        return (
            <div className="board">
                {list}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        const squares = Array(64).fill(null);
        squares[27] = CONFIG.whiteStone;
        squares[28] = CONFIG.blackStone;
        squares[35] = CONFIG.blackStone;
        squares[36] = CONFIG.whiteStone;

        this.state = {
            squares: squares,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        if(squares[i]) return;

        const turn = getTurn(this.state.xIsNext, squares);
        const next = turn !== CONFIG.blackStone;
        if(turn === null) return;

        const target = getReversibleSquares(i, turn, squares);
        if(target.length === 0) return;
        target.forEach(e => squares[e] = turn);

        this.setState({
            squares: squares,
            xIsNext: next,
        });
    }

    render() {
        let winner = null;
        let status = null;

        const squares = this.state.squares.slice();
        const turn = getTurn(this.state.xIsNext, squares);

        if(turn === null) {
            winner  = calculateWinner(squares);
        }

        if(winner) {
            status = 'Result:' + winner;
        } else {
            status = 'Next player: ' + turn;
        }

        const stoneCount = getStoneCount(squares);

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                     squares={squares}
                     onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{`black: ${stoneCount.black}`}</div>
                    <div>{`white: ${stoneCount.white}`}</div>
                </div>
            </div>
        );
    }
}

function getTurn(isBlackTurn, squares) {
    let enableSquares = new Array();
    const first  = isBlackTurn ? CONFIG.blackStone : CONFIG.whiteStone;
    enableSquares = getEnableSquares(first, squares);
    if(enableSquares.length > 0) return first; 

    const second = !isBlackTurn ? CONFIG.blackStone : CONFIG.whiteStone;
    enableSquares = getEnableSquares(second, squares);
    if(enableSquares.length > 0) return second; 

    return null;
}

function calculateWinner(squares) {
    const black = CONFIG.blackStone;
    const white = CONFIG.whiteStone;
    const stoneCount = getStoneCount(squares);
    if(stoneCount.black === stoneCount.white) return 'Draw';
    if(stoneCount.black > stoneCount.white) return black;
    if(stoneCount.black < stoneCount.white) return white;
}

function getStoneCount(squares) {
    const blackStone = CONFIG.blackStone;
    const whiteStone = CONFIG.whiteStone;
    let blackStoneCount = 0;
    let whiteStoneCount = 0;
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] === null) continue;
        if(squares[i] === blackStone) blackStoneCount++;
        if(squares[i] === whiteStone) whiteStoneCount++;
    }

    return {
        black: blackStoneCount,
        white: whiteStoneCount
    };
} 


function getEnableSquares(stone, squares) {
    const enableSquares = new Array();
    let reversibleSquares = new Array();
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] !== null) continue;
        reversibleSquares = getReversibleSquares(i, stone, squares);
        if(reversibleSquares.length === 0) continue;
        enableSquares.push(reversibleSquares);
    }
    return enableSquares;
}

function getReversibleSquares(i, stone, squares) {
    let result = new Array();
    let tmp = new Array();
    let count = 0;
    let current = 0;
    const directions = getDirections();

    for(const k of Object.keys(directions)) {
        count = 0;
        current = i;
        tmp = new Array();

        while(true) {
            if(count === 0) {
                const next = current + directions[k];
                if(squares[next] === null)  break;
                if(squares[next] === stone) break;
            }
        
            if(count !== 0) {
                if(squares[current] === null) break;
            }

            if(squares[current] === stone) {
                result = result.concat(tmp);
                break;
            }

            if(isLimit(current, k) === true) break;
            
            count++;
            tmp.push(current);
            current += directions[k];
        }
    }

    return result;
}

function isLimit(i, d) {
    const limit = getLimit();
    return limit[d].indexOf(i) !== -1;
}

function getDirections() {
    return {
        tl: -9,
        t:  -8,
        tr: -7,
        l:  -1,
        r:  1,
        bl: 7,
        b:  8,
        br: 9
    };
}

function getLimit() {
    const t = [0, 1, 2, 3, 4, 5, 6, 7];
    const l = [0, 8, 16, 24, 32, 40, 48, 56];
    const r = [7, 15, 23, 31, 39, 47, 55, 63];
    const b = [56, 57, 58, 59, 60, 61, 62, 63];

    const tl = l.concat(t);
    const tr = r.concat(t);
    const bl = l.concat(b);
    const br = r.concat(b);

    return {
        tl: tl,
        t:  t,
        tr: tr,
        l:  l,
        r:  r,
        bl: bl,
        b:  b,
        br: br
    };
}

const CONFIG = {
    whiteStone: 'white',
    blackStone: 'black'
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
