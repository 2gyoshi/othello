import React from 'react';
import Button from './button.js';
import './common.css';
import './confirm.css';

function Confirm(props) {
    return(
        <div className={`confirm ${'-' + props.viewState}`}>
            <p class="confirm__message">
                {props.message}
            </p>
            <Button 
             value="OK"
             className="confirm__button -ok"
             onClick={props.onClickOK}
            />
            <Button 
             value="Cancel"
             className="confirm__button -cancel"
             onClick={props.onClickCancel}
            />
        </div>
    );
}

export default Confirm;