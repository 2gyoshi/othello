import React from 'react';

export default function Toggle(props) {
    return (
        <button className={`toggle ${props.mode}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}


