import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-regular-svg-icons";

import CONFIG from './config.js';
import Board from './board.js';
import GameInfo from './game-info.js'
import SkillButton from './toggle.js';
import Stone from './stone.js';
import './game.css'

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.id = this.props.location.state.id;
        this.roomId = this.props.location.state.roomId;
        this.initSocket();

        const squares = Array(64).fill(null);
        squares[27] = CONFIG.whiteStone;
        squares[28] = CONFIG.blackStone;
        squares[35] = CONFIG.blackStone;
        squares[36] = CONFIG.whiteStone;

        const color = this.props.location.state.color;
        const skill = this.props.location.state.skill;

        this.state = {
            color: color,
            skill: skill,
            xIsNext: true,
            squares: squares,
            history: [squares],
            isSpMode: false,
            canUseSp: true,
            gameState: 'playing',
        };
    }
    
    initSocket() {
        const socket = window.io.connect(window.location.host);

        // サーバールームに入る
        socket.emit('enter', this.roomId);

        // サーバーからデータを受信する
        socket.on('message', msg => this.recieve(msg));

        // サレンダーの発生を検知する
        socket.on('surrender', id => this.end(id))
    }

    send(data) {
        const socket = window.io.connect(window.location.host);
        socket.emit('message', JSON.stringify(data));
    }

    recieve(msg) {
        const data = JSON.parse(msg);
        this.setState({
            squares: data.squares,
            xIsNext: data.xIsNext,
            history: data.history,
        });
    }

    handleClick(i) {
        const squares = this.state.squares.slice();

        const turn = getTurn(this.state.xIsNext, squares);
        const next = turn !== CONFIG.blackStone;
        if(turn !== this.state.color) return;
        if(turn === null) return;
        
        if(this.state.isSpMode) return this.useSpecial(i);

        const enableSquares = getEnableSquares(this.state.color, squares);
        if(!enableSquares.includes(i)) return;

        const processed = this.getReversedSquares(i);

        const history = this.state.history;
        history.push(squares);

        this.setState({
            squares: processed,
            xIsNext: next,
        });

        this.send({
            id: this.id,
            squares: processed,
            xIsNext: next,
            history: history,
        });
    }

    getReversedSquares(i) {
        const squares = this.state.squares.slice();
        if(squares[i] !== null) return squares;

        const color = this.state.color;
        const reversibleSquares = getReversibleSquares(i, color, squares);
        reversibleSquares.forEach(e => squares[e] = color);

        return squares;
    }

    toggleMode() {
        if(this.state.canUseSp === false) return;

        const squares = this.state.squares.slice();
        const turn = getTurn(this.state.xIsNext, squares);
        if(turn !== this.state.color) return;
        if(turn === null) return;

        this.setState({
            isSpMode: !this.state.isSpMode,
        });
    }

    useSpecial(i) {
        let squares = this.state.squares.slice();
        let next = ''; 

        if(this.state.skill === 'reverse') {
            if(squares[i] === null) return;
            if(squares[i] === 'block') return;
            next = !this.state.xIsNext; 
            squares[i] = squares[i] === 'black' ? 'white' : 'black';
        }

        if(this.state.skill === 'double') {
            console.log(this.state.history.length);
            if(this.state.history.length < 5) return;
            next = this.state.xIsNext; 
            squares = this.getReversedSquares(i);
        }
        
        if(this.state.skill === 'block') {
            if(squares[i] !== null) return;
            next = !this.state.xIsNext; 
            squares[i] = 'block';
        }

        const history = this.state.history;
        history.push(squares);

        this.setState({
            squares: squares,
            xIsNext: next,
            isSpMode: false,
            canUseSp: false,
        });

        this.send({
            id: this.id,
            squares: squares,
            xIsNext: next,
            history: history,
        });
    }

    confirm() {
        console.log('confirm')
        this.setState({
            gameState: 'confirm',
        })
    }

    surrender() {
        const socket = window.io.connect(window.location.host);
        socket.emit('surrender', this.id);
    }

    continue() {
        console.log('continue')
        this.setState({
            gameState: 'playing',
        });
    }

    end(surrenderId) {
        const data = {
            playerId: this.id, 
            surrenderId: surrenderId,
            myColor: this.color,
            history: this.state.history,
        };

        this.props.history.push({
            state: data,
            pathname: '/work/othello/result',
        });
    }

    render() {
        const squares = this.state.squares.slice();
        const turn = getTurn(this.state.xIsNext, squares);

        let enableSquares = getEnableSquares(this.state.color, squares);
        if(this.state.color !== turn) enableSquares = [];

        const p1 = this.state.color;
        const p2 = this.state.color === 'black' ? 'white' : 'black';
        const count = getStoneCount(squares);

        if(turn === null) return this.end();

        return (
            <div className="game">
                <div className="game-board">
                    <GameInfo side="opponent">
                        <div className="name">Player2</div>
                        <Stone color={p2} count={count[p2]} />
                    </GameInfo>

                    <Board 
                     squares={squares}
                     enableSquares={enableSquares}
                     onClick={i => this.handleClick(i)}
                    />

                    <GameInfo side="player">
                        <Stone color={p1} count={count[p1]} />
                        <div className="name">Player1</div>
                        <SkillButton
                         mode={this.state.isSpMode ? 'special' : 'normal'}
                         value={this.state.skill}
                         onClick={() => this.toggleMode()}
                        />
                        <Surrender onClick={() => this.confirm()} />
                    </GameInfo>

                </div>
                
                <Layer
                 className="game__layer"
                 viewState={this.state.gameState === 'confirm' ? 'show' : 'hidden'}
                />

                <Confirm
                 viewState={this.state.gameState === 'confirm' ? 'show' : 'hidden'}
                 onClickOK={this.surrender.bind(this)}
                 onClickCancel={this.continue.bind(this)}
                />

            </div>
        );
    }
}

export default Game;

function Confirm(props) {
    return(
        <div className={`game__confirm ${'-' + props.viewState}`}>
            <p class="game__message">
                降参しますか？
            </p>
            <Button 
             value="OK"
             className="game__button -ok"
             onClick={props.onClickOK}
            />
            <Button 
             value="Cancel"
             className="game__button -cancel"
             onClick={props.onClickCancel}
            />
        </div>
    );
}

function Layer(props) {
    return (
        <div className={`${props.className} ${'-' + props.viewState}`} />
    )
}

function Button(props) {
    return(
        <button className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Surrender(props) {
    return (
        <Button
         value={<FontAwesomeIcon icon={faFlag}/>}
         className="game__button -surrender"
         onClick={() => props.onClick()}
        />
    );
}

function getTurn(isBlackTurn, squares) {
    let enableSquares = [];
    const first  = isBlackTurn ? CONFIG.blackStone : CONFIG.whiteStone;
    enableSquares = getEnableSquares(first, squares);
    if(enableSquares.length > 0) return first; 

    const second = !isBlackTurn ? CONFIG.blackStone : CONFIG.whiteStone;
    enableSquares = getEnableSquares(second, squares);
    if(enableSquares.length > 0) return second; 

    return null;
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

function getEnableSquares(stone, squares) {
    let enableSquares = [];
    let reversibleSquares = [];
    for (let i = 0; i < squares.length; i++) {
        if(squares[i] !== null) continue;
        reversibleSquares = getReversibleSquares(i, stone, squares);
        if(reversibleSquares.length === 0) continue;
        enableSquares = enableSquares.concat(reversibleSquares);
    }

    return enableSquares.filter(e => squares[e] === null);
}

function getReversibleSquares(i, stone, squares) {
    let result = [];
    let tmp = [];
    let count = 0;
    let current = 0;
    const directions = getDirections();

    for(const k of Object.keys(directions)) {
        count = 0;
        current = i;
        tmp = [];

        while(true) {
            if(count === 0) {
                const next = current + directions[k];
                if(squares[next] === null)  break;
                if(squares[next] === stone) break;
            }
        
            if(count !== 0) {
                if(squares[current] === null) break;
            }

            if(squares[current] === 'block') break;

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
