import React from 'react';
import Button from './button.js'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-regular-svg-icons";

class SkillButton extends React.Component {
    render() {
        return (
            <Button
            value={<FontAwesomeIcon icon={faStar}/>}
            className="game__button -skill"
            onClick={() => this.props.onClick()}
           />
   
        );
    }
}

export default SkillButton;
