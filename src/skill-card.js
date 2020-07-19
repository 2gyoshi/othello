import React from 'react';
import CONFIG from './config.js';

export default class SkillCard extends React.Component {
    constructor(props) {
        super(props);

        this.name = this.props.skill;
        this.description = CONFIG.skill[this.name].description;
    }

    render(){
        return (
            <a className={`card ${this.name}`} onClick={this.props.onClick}>
                <span className="name">
                    {this.name}
                </span>
                <p className="description">
                    {this.description}
                </p>
            </a>
        );
    }
}
