//session
import {KWillFetchingData, KHasFetchedData, KFetched_Recive_Error} from '../action/baseAction'

const init_ajaxState = {
    isFetching: false, //是否正在获取数据
}


/************   reducer     ***************/

/**
 * reducer 与ajax的状态有关的reducer
 * @param {*} state
 * @param {*} action
 */
export const ajaxState = (state = init_ajaxState, action = {}) => {
    let newState = Object.assign({}, state) 
    switch (action.type) {
    case KWillFetchingData:
        return newState['isFetching'] = true
    case KHasFetchedData:
        return newState['isFetching'] = false
    case KFetched_Recive_Error:
        return newState['isFetching'] = false
    default:
        return state
    }
}

