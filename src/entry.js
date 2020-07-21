import React from 'react';
import Dialog from './dialog.js';

const MODE = 'develop';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: '', roomId: '' };
        this.init();
    }

    init() {
        const max = 99999;
        const min = 10000;
        this.id = Math.floor( Math.random() * (max + 1 - min) ) + min;

        // socket.io に接続する
        const socket = window.io.connect(window.location.host);

        // サーバーにデータを送信する
        socket.emit('login', this.id);
        
        if(MODE === 'develop') {
            return setTimeout(() => {
                this.setState({
                    color: 'black',
	            roomId: 'test',
                });
            }, 1000);
        }

        // サーバーからデータを受信する
        socket.on('message', msg => this.recieve(msg));
    }

    recieve(data) {
        this.setState({
            color: data.color[this.id],
	    roomId: data.roomId,
        });
    }

    ready() {
        return setTimeout(() => {
            this.start();
        }, 1000)
    }


    start() {
        const skill = this.props.location.state.skill;

        const data = {
            id: this.id,
            roomId: this.state.roomId,
            color: this.state.color,
            skill: skill,
        }

        this.props.history.push({
            state: data,
            pathname: '/work/othello/game',
        });
    }

    render() {
        if(!this.state.color) {
            return (
                <Dialog
                 message="対戦相手を探しています..."
                 kind="waiting"
                />
            );
        }

        this.ready();

        return (
            <Dialog
                message="対戦相手が見つかりました"
                kind="normal"
            />
        );
    }
}

export default Entry;
