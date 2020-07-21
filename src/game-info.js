import React from 'react';

export default function GameInfo(props) {
    return (
        <div className={`game-info ${props.side}`}>
            {props.children}
        </div>
    );
}
