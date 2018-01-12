import {combineReducers} from 'redux'
import {ajaxState} from './baseReducer'
import {QuestionTreeReducer} from './QuestionTreeReducer'

export default combineReducers({
    QuestionTreeReducer,
    ajaxState
})