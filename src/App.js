import React, { PureComponent,Fragment } from 'react'
import {Route,Switch,Redirect} from 'react-router-dom';
import Admin from './containers/admin/admin';
import Login from './containers/login/login';

export default class App extends PureComponent {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path='/admin' component={Admin}/>
                    <Route path='/login' component={Login}/>
                    <Redirect to='/admin'/>
                </Switch>
            </Fragment>
        )
    }
}
