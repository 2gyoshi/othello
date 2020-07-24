import React from 'react';
import Dialog from './dialog.js';
import Button from './button.js';
import './common.css';
import './entry.css';

const MODE = 'develop';

class Entry extends React.Component {
    constructor(props) {
        super(props);
        this.state = { color: '', roomId: '' };
        this.init();
    }

    init() {
        // ブラウザバックを禁止する
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', (e) => {
          window.history.go(1);
        });

        const max = 99999;
        const min = 10000;
        this.id = Math.floor( Math.random() * (max + 1 - min) ) + min;

        // socket.io に接続する
        const socket = window.io.connect(window.location.host);

        // サーバーにデータを送信する
        socket.emit('entry', this.id);
        
        if(MODE === 'develop') {
            return setTimeout(() => {
                this.setState({
                    color: 'black',
                    roomId: 'test',
                });
            }, 1000);
        }

        // サーバーからデータを受信する
        socket.on('roomIdFromServer', msg => this.recieve(msg));
    }

    recieve(data) {
        this.setState({
            color: data.color[this.id],
            roomId: data.roomId,
        });
    }

    cancel() {
        const socket = window.io.connect(window.location.host);
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
