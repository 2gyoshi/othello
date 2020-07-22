import React from 'react';

export default function Dialog(props) {
    return (
        <div className={`${props.className} ${props.kind}`}>
            {props.message}
        </div>
    );
}
