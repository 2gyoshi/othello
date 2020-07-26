import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import Card from './card';
import CONFIG from './config.js';
import './skill.css'

class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.reverse = CONFIG.skill.reverse;
        this.double  = CONFIG.skill.double;
        this.block   = CONFIG.skill.block;
    }

    onClickCard(skill) {
        const roomId = this.props.location.state;
        const data = {
            skill: skill.name, 
            roomId: roomId,
        };

        this.props.history.push({
            pathname: '/work/othello/entry',
            state: data,
        });
    }

    render() {
        return (
            <div className="skill">
                <header className="skill__header">
                    <h1 className="skill__title">
                        スキルを選んでください。
                    </h1>
                </header>
                <Card
                 className="skill__card"
                 thumbnail={<FontAwesomeIcon icon={faExchangeAlt}/>}
                 data={this.reverse}
                 onClick={this.onClickCard.bind(this, this.reverse)}
                />
                <Card
                 className="skill__card"
                 thumbnail="x2"
                 data={this.double}
                 onClick={this.onClickCard.bind(this, this.double)}
                />
                <Card
                 className="skill__card"
                 thumbnail={<FontAwesomeIcon icon={faTimesCircle}/>}
                 data={this.block}
                 onClick={this.onClickCard.bind(this, this.block)}
                />
            </div>
        );
    }
}

export default Skill;
