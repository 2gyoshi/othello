import React from 'react';

export default function Square(props) {
    return (
        <button className={`square ${props.value} ${props.enable}`} onClick={props.onClick} />
    );
}