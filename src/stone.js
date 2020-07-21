import React from 'react';

function Stone(props) {
    return (
        <div className={`stone ${props.color}`}>
            {props.count}
        </div>
    );
}

export default Stone;
