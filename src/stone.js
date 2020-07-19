import React from 'react';

export default function Stone(props) {
    return (
        <div className={`stone ${props.value}`}>
            {props.count}
        </div>
    );
}


