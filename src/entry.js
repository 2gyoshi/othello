import React from 'react';
import SkillCard from './skill-card';

export default function Entry(props) {
    return (
        <div className="entry">
            <header className="entry__header">
                <h1 className="entry__title">
                    スキルを選んでください。
                </h1>
            </header>
            <SkillCard
                skill="reverse"
                onClick={() => props.onClick("reverse")}
            />
            <SkillCard
                skill="double"
                onClick={() => props.onClick("double")}
            />
            <SkillCard 
                skill="block" 
                onClick={() => props.onClick("block")}
            />
        </div>
    );
}

