import React from 'react';

function Stone(props) {
    return (
        <div className={props.className}>
            {props.count}
        </div>
    );
}

export default Stone;
