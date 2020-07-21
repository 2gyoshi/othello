import React from 'react';
import Card from './card';
import CONFIG from './config.js';

class Skill extends React.Component {
    constructor(props) {
        super(props);

        this.reverse = CONFIG.skill.reverse;
        this.double  = CONFIG.skill.double;
        this.block   = CONFIG.skill.block;
    }

    onClickCard(skill) {
        const data = {skill: skill.name};
        this.props.history.push({
            pathname: '/work/othello/match',
            state: data,
        });
    }

    render() {
        return (
            <div className="entry">
                <header className="entry__header">
                    <h1 className="entry__title">
                        スキルを選んでください。
                    </h1>
                </header>
                <Card
                 data={this.reverse}
                 onClick={this.onClickCard.bind(this, this.reverse)}
                />
                <Card
                 data={this.double}
                 onClick={this.onClickCard.bind(this, this.double)}
                />
                <Card
                 data={this.block}
                 onClick={this.onClickCard.bind(this, this.block)}
                />
            </div>
        );
    }
}

export default Skill;
