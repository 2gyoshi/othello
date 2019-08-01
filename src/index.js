import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button 
      className={`square  ${props.value}`} 
      onClick={props.onClick}
    >
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    let squares = [];
    for(let i = 0; i < 64; i++){
      squares[i] = '';
      if(i ===  27 || i === 36){
        squares[i] = 'bstone';
      }
      if(i ===  35 || i === 28){
        squares[i] = 'wstone';
      }
    }
    this.state = {
      squares: squares,
      xIsNext: true,
      message: '',
    };
  }

  getLimit(i){
    let col = i;
    while(col >= 8){
      col += -8;
    }
    let min = i - col;
    let max = min + 7;
    const limit = {
      min: min,
      max: max,
    }
    return limit;
  }

  canPutStone(i, direction, isFirstCall, min, max){
    let ret = false;
    const squares = this.state.squares.slice();
    const turn = this.state.xIsNext ? 'bstone' : 'wstone';
    if(i >= min && i <= max){
      i += direction;
      switch(squares[i]){
        case '' :
          ret = false;
          break;
        case turn :
          ret = isFirstCall ? false : true;
          break;
        default :
          ret = this.canPutStone(i, direction, false, min, max);
          break;
      }
    }
    return ret;
  }

  reverseSones(i, direction, squares, min, max){
    const turn = this.state.xIsNext ? 'bstone' : 'wstone';
    squares[i] = turn;
    while(i　>= min && i <= max){
      squares[i] = turn;
      i += direction;
      if(squares[i] === turn){
        break;
      }
    }
    return squares;
  }

  handleClick(i) {
    let squares = this.state.squares.slice();
    let xIsNext = this.state.xIsNext;
    let message = 'You cannot put stone there.';
    let flg = false;
    if (calculateWinner(squares) || squares[i]) {
      return;
    } 
    const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
    for(let j=0; j<directions.length; j++){
      let min = 0;
      let max = 63;
      if(directions[j] === 1 || directions[j] === -1){
        const limit = this.getLimit(i)
        min = limit.min;
        max = limit.max;
      }
      if(this.canPutStone(i, directions[j], true, min, max)){
        squares = this.reverseSones(i, directions[j], squares, min, max);
        flg = true;
      }
    }
    if(flg === true){
      message = '';
      xIsNext = !xIsNext;
    }
    this.setState({
      squares: squares,
      xIsNext: xIsNext,
      message: message,
    });
  }

  skipClick(){
    this.setState({
      xIsNext: !this.state.xIsNext,
    })
  }


  createSquares(i){
    return (
      <Square
        key={i}
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  createRows(start) {
    let ret = [];
    const end = start + 8;
    for(let i = start; i < end; i++){
      ret.push(this.createSquares(i));
    }
    return (
      <div className="board-row" key={start}>
        {ret}
      </div>
    );
  }

  renderSquare() {
    let ret = []
    for(let i = 0; i < 8; i++){
      ret.push(this.createRows(i * 8));
    }
    return ret;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let message = this.state.message;
    let status;
    if (winner !== '') {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'black' : 'white');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="message">{message}</div>
        <button 
          className={"skip"} 
          onClick={() => this.skipClick()}
        >
          skip
        </button>
        {this.renderSquare()}
      </div>
    );
  }
}
 
class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  let winner = '';
  if(isGameEnd(squares) === true){
    return winner;
  }
  let bstones = 0;
  let wstones = 0;
  for(let i=0; i<64; i++){
    if(squares[i] === 'bstone'){
      bstones++;
    }
    if(squares[i] === 'wstone'){
      wstones++;
    }
  }
  if(bstones === wstones){
    winner = 'draw';
  }
  if(bstones > wstones){
    winner = 'black';
  }
  if(bstones < wstones){
    winner = 'white';
  }
  return winner
}

function isGameEnd(squares) {
  let flg = false;
  for(let i=0; i<64; i++){
    if(squares[i] === ''){
      flg = true;
    }
  }
  return flg;
}