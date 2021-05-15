//从redux中引入createStore，用于创建最核心的store对象
import {createStore,applyMiddleware} from 'redux';
//引入汇总的reducer
import reducers from './reducers/index';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))