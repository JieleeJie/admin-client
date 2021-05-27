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
                    {/* to='/admin/home' 而不是 to='/admin' 是为了匹配到/home而在header.jsx中显示标题“首页” */}
                    <Redirect to='/admin/home'/>
                </Switch>
            </Fragment>
        )
    }
}
