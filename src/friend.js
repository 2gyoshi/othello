import React from 'react';
import Button from './button.js'
import './friend.css';

class Friend extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code: '',
            warning: '',
        };
    }

    onClickOKButton() {
        if(this.state.code === '') {
            this.setState({
                warning: '対戦コードが入力されていません'
            });
            return;
        }

        const data = {roomId: this.state.code}
        this.props.history.push({
            pathname: '/work/othello/skill',
            state: data,
        });
    }
    
    onClickCancelButton() {
        this.props.history.push('/work/othello/');
    }

    onChangeText(e) {
        this.setState({
            code: e.target.value,
        });
    }

    render() {
        return(
            <div className="friend">
                <div className="friend__form">
                    <TextBox
                      blockName="friend"
                      label="対戦コード"
                      warning={this.state.warning}
                      onChange={e => this.onChangeText(e)}
                    />
                    <ButtonArea blockName="friend">
                        <Button 
                        className="friend__button -ok"
                        value="OK"
                        onClick={() => this.onClickOKButton()}
                        />
                        <Button 
                        value="Cancel"
                        className="friend__button -cancel"
                        onClick={() => this.onClickCancelButton()}
                        />
                    </ButtonArea>
                </div>
            </div>
        );
    }
}

function TextBox(props) {
    return (
        <div className={`${props.blockName}__textbox`}>
            <label className={`${props.blockName}__label`}>
                {props.label}
            </label>
            <div>
                <input
                className={`${props.blockName}__input`}
                onChange={props.onChange}
                />
                <p className={`${props.blockName}__warning`}>
                    {props.warning}
                </p>
            </div>
        </div>
    );
}

function ButtonArea(props) {
    return (
        <div className={`${props.blockName}__button-area`}>
            {props.children}
        </div>
    );
}


export default Friend;
