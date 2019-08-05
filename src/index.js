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

function Stone(props) {
  return (
    <div className={props.value}></div>
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

  getDirections(){
    return [-9, -8, -7, -1, 1, 7, 8, 9];
  }

  getLimits(){
    return {
      'top'     : [0,  1,  2,  3,  4,  5,  6,  7 ],
      'left'    : [0,  8,  16, 24, 32, 40, 48, 56],
      'right'   : [7,  15, 23, 31, 39, 47, 55, 63],
      'bottom'  : [56, 57, 58, 59, 60, 61, 62, 63],
    };
  }

  getLimitsByDir(direction){
    let limits = this.getLimits();
    let val = [];
    switch(direction){
      case -9 :
        val.push(limits.top);
        val.push(limits.left);
        break;
      case -8 :
        val.push(limits.top);
        break;
      case -7 :
        val.push(limits.top);
        val.push(limits.right);
        break;
      case -1 :
        val.push(limits.left);
        break;
      case 1 :
        val.push(limits.right);
        break;
      case 7 :
        val.push(limits.bottom);
        val.push(limits.left);
        break;
      case 8 :
        val.push(limits.bottom);
        break;
      case 9 :
        val.push(limits.bottom);
        val.push(limits.right);
        break;
      default :
        break;
    }
    return val;
  }

  isLimit(targetSquare, direction){
    let val = false;
    let limits = this.getLimitsByDir(direction);
    console.log(direction);
    console.dir(limits);
    for(let i=0; i<limits.length; i++){
      if(limits[i].indexOf(targetSquare) >= 0){
        val = true;
      }
    }
    return val;
  }

  canPutStone(targetSquare, direction, calledCount){
    let ret = false;
    const squares = this.state.squares.slice();
    const turn = this.state.xIsNext ? 'bstone' : 'wstone';
    if(this.isLimit(targetSquare, direction) === false){
      targetSquare += direction;
      switch(squares[targetSquare]){
        case '' :
          ret = false;
          break;
        case turn :
          ret = (calledCount === 1) ? false : true;
          break;
        default :
          ret = this.canPutStone(targetSquare, direction, ++calledCount);
          break;
      }
    }
    return ret;
  }

  reverseSones(i, direction, squares){
    const turn = this.state.xIsNext ? 'bstone' : 'wstone';
    squares[i] = turn;
    while(this.isLimit(i, direction) === false){
      squares[i] = turn;
      i += direction;
      if(squares[i] === turn){
        break;
      }
    }
    return squares;
  }

  handleClick(clickedButton) {
    let squares = this.state.squares.slice();
    let xIsNext = this.state.xIsNext;
    let message = 'You cannot put stone there.';
    let flg = false;
    if (calculateWinner(squares) || squares[clickedButton]) {
      return;
    } 
    const directions = this.getDirections();
    for(let i=0; i<directions.length; i++){
      if(this.canPutStone(clickedButton, directions[i], 1)){
        squares = this.reverseSones(clickedButton, directions[i], squares);
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