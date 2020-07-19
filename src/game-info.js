import React from 'react';
import Toggle from './toggle.js';
import Stone from './stone.js';

export default function GameInfo(props) {
    return (
        <div className={`game-info ${props.side}`}>
            <div className="count">
                <Stone
                 value={props.color}
                 count={props.count}
                />
            </div>
            <div className="name">{props.name}</div>
            <Toggle
             mode={props.mode}
             value={props.value}
             onClick={() => props.onClick()}
            />
        </div>
    );
}
