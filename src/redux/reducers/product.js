import {SAVE_PROD_LIST} from '../constant'

let initState = []
export default function productReducer(preState=initState,action) {
    const {type,data} = action
    let newState
    switch (type) {
        case SAVE_PROD_LIST:
            newState = [...data]
            return newState
        default:
            return preState
    }
} 