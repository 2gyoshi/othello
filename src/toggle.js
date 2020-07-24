import React from 'react';
import Button from './button.js'

class SkillButton extends React.Component {
    render() {
        return (
            <Button
             className={`game__button -skill -${this.props.mode}`}
             onClick={() => this.props.onClick()}
            />
        );
    }
}

export default SkillButton;
