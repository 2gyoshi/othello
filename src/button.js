import React from 'react';
import './button.css';

function Button(props) {
    return(
        <button className={props.className} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default Button;