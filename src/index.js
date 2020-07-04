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
        squares[27] = CONFIG.blackStone;
        squares[28] = CONFIG.whiteStone;
        squares[35] = CONFIG.whiteStone;
        squares[36] = CONFIG.blackStone;

        this.state = {
            history: [{
                squares: squares
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) return;

        const stone  = this.state.xIsNext ? CONFIG.blackStone : CONFIG.whiteStone;
        const target = getReverseTarget(i, stone, squares);
        if(target.length === 0) return;
        target.forEach(e => squares[e] = stone);

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner  = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner) {
            status = 'Winner' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? CONFIG.blackStone : CONFIG.whiteStone);
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                     squares={current.squares}
                     onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function getReverseTarget(i, stone, squares) {
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
                
                if(squares[next] === null) {
                    break;
                };
                
                if(squares[next] === stone) {
                    break;
                };
            }
        
            if(count !== 0) {
                if(squares[current] === null) {
                    break;
                };
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

function calculateWinner(squares) {
    // const lines = [
    //   [0, 1, 2],
    //   [3, 4, 5],
    //   [6, 7, 8],
    //   [0, 3, 6],
    //   [1, 4, 7],
    //   [2, 5, 8],
    //   [0, 4, 8],
    //   [2, 4, 6],
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //   const [a, b, c] = lines[i];
    //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //     return squares[a];
    //   }
    // }
    return null;
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
