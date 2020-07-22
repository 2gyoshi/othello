import React from 'react';

class Card extends React.Component {
    render() {
        return (
            <button className={this.props.className}
             onClick={this.props.onClick}>
                <span className="name">
                    {this.props.data.name}
                </span>
                <p className="description">
                    {this.props.data.description}
                </p>
            </button>
        );
    }
}

export default Card;

