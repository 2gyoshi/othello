import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Index from './index.js'
import Friend from './friend.js';
import Skill from './skill.js';
import Entry from'./entry.js';
import Game from'./game.js';
import Result from './result.js';

export default class Routing extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/work/nothello" component={Index} />
                    <Route exact path="/work/nothello/skill" component={Skill} />
                    <Route exact path="/work/nothello/friend" component={Friend} />
                    <Route exact path="/work/nothello/entry" component={Entry} />
                    <Route exact path="/work/nothello/game" component={Game} />
                    <Route exact path="/work/nothello/result" component={Result} />
                </Switch>
            </Router>
        );
    }
}


