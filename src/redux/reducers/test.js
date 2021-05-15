import { TEST1, TEST2 } from '../constant';

let initState = 'hello, TEST'
export default function test(preState = initState, action) {
    const { type, data } = action
    let newState
    switch (type) {
        case TEST1:
            newState = preState + data+ '@@@1'
            return newState
        case TEST2:
            newState = preState + data+ '@@@2'
            return newState
        default:
            return preState;
    }
}