import React from 'react';

export default function Dialog(props) {
    return (
        <div className={`dialog ${props.kind} ${props.view}`}>
            {props.message}
        </div>
    );
}
