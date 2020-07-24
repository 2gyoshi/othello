import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Index from './index.js'
import Skill from './skill.js';
import Entry from'./entry.js';
import Game from'./game.js';
import Result from'./result.js';

export default class Routing extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/work/othello" component={Index} />
                    <Route exact path="/work/othello/skill" component={Skill} />
                    <Route exact path="/work/othello/friend" component={Skill} />
                    <Route exact path="/work/othello/entry" component={Entry} />
                    <Route exact path="/work/othello/game" component={Game} />
                    <Route exact path="/work/othello/result" component={Result} />
                </Switch>
            </Router>
        );
    }
}


