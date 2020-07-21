import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Index from './index.js'
import Entry from'./entry.js';
import Match from './match.js';
import Game from'./game.js';

export default class Routing extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route key="index" exact path="/work/othello" component={Index} />
                    <Route key="entry" exact path="/work/othello/entry" component={Entry} />
                    <Route key="friend" path="/work/othello/friend" component={Entry} />
                    <Route key="game" path="/work/othello/match" component={Match} />
                    <Route key="game" path="/work/othello/game" component={Game} />
                </Switch>
            </Router>
        );
    }
}


