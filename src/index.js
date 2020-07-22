import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './routing.js'
import './index.css';

 class Index extends React.Component {
    onClickEntryBtn() {
        this.props.history.push('/work/othello/entry');
    }
    
    onClickFriendBtn() {
        this.props.history.push('/work/othello/friend');
    }

    render() {
        return(
            <div className="index">
                <header className="index__header">
                    <h1 className="index__title">
                        もはやオセロではない
                    </h1>
                </header>
                <div className="index__button-area">
                    <button
                     className="index__button"
                     onClick={this.onClickEntryBtn.bind(this)}>
                        対戦
                    </button>
                    <button
                     className="index__button"
                     onClick={this.onClickFriendBtn.bind(this)}>
                        友達と対戦
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
