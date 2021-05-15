import React, { PureComponent,Fragment } from 'react'
import {Route,Switch} from 'react-router-dom';
import Admin from './pages/admin/admin';
import Login from './pages/login/login';

export default class App extends PureComponent {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path='/admin' component={Admin}/>
                    <Route path='/login' component={Login}/>
                </Switch>
            </Fragment>
        )
    }
}
