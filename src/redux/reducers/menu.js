import { SAVE_TITLE } from '../constant';

let initState = ''
export default function menuReducer(preState = initState, action) {
    const { type, data } = action
    let newState
    switch (type) {
        case SAVE_TITLE:
            newState = data
            return newState
        default:
            return preState
    }
}