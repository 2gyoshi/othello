import React from 'react';
import Dialog from './dialog.js';
import Button from './button.js';
import './common.css';
import './entry.css';

import Websocket from './websocket.js';

const MODE = 'product';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: '' };
        this.init();
    }

    init() {
        // ブラウザバックを禁止する
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', (e) => {
          window.history.go(1);
        });

        // socket.io に接続する
        const socket = Websocket.getSocket();

	this.id = socket.id;
	this.roomId = this.props.location.state.roomId;

        // サーバーにデータを送信する
        if(!this.roomId) {
            socket.emit('entry');
        } else {
            socket.emit('entryForFriend', this.roomId);
        }

        if(MODE === 'develop') {
            return setTimeout(() => {
                this.setState({
                    color: 'black',
                });
            }, 1000);
        }

        // サーバーからデータを受信する
        socket.on('success', data => this.recieve(data));
    }

    recieve(data) {
	this.roomId = data.roomId;
        this.setState({
            color: data.colors[this.id],
        });
    }

    cancel() {
        const socket = Websocket.getSocket();
        socket.emit('exit', this.id);

        this.props.history.push('/work/othello');
    }

    ready() {
        return setTimeout(() => {
            this.start();
        }, 1000);
    }

    start() {
        const skill = this.props.location.state.skill;

        const data = {
            id: this.id,
	    roomId: this.roomId,
            color: this.state.color,
            skill: skill,
        }

        this.props.history.push({
            state: data,
            pathname: '/work/othello/game',
        });
    }

    render() {
        let message, kind;

        if(!this.state.color) {
            message = "対戦相手を探しています..."
            kind = "waiting"
        }

        if(this.state.color) {
            this.ready();
            message = "対戦相手が見つかりました。"
            kind = "normal"
        }

        return (
            <div className="entry">
                
                <Dialog
                 className="entry__dialog"
                 kind={kind}
                 message={message}
                />
                
                <Button
                 className="entry__button -cancel"
                 value="キャンセル"
                 onClick={() => this.cancel()}
                />

            </div>
        );
    }
}

export default Entry;
