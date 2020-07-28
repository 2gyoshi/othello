import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './routing.js';
import './common.css';
import './index.css';

 class Index extends React.Component {
    onClickEntryBtn() {
        this.props.history.push({
            pathname: '/work/nothello/skill',
            state: '',
        });
    }
    
    onClickFriendBtn() {
        this.props.history.push('/work/nothello/friend');
    }

    render() {
        return(
            <div className="index">
                <header className="index__header">
                    <h1 className="index__title">
                        NOTHELLO
                    </h1>
                </header>
                <div className="index__button-area">
                    <button
                     className="index__button"
                     onClick={this.onClickEntryBtn.bind(this)}>
                        フリー対戦
                    </button>
                    <button
                     className="index__button"
                     onClick={this.onClickFriendBtn.bind(this)}>
                        フレンド対戦
                    </button>
                </div>  
            </div>
        );  
    }
}

export default Index;

// ========================================

ReactDOM.render(
    <Routing />,
    document.getElementById('root')
);
