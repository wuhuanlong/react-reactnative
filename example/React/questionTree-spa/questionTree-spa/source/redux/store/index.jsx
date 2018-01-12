import {createStore, applyMiddleware, compose} from 'redux'
import reducer from '../reducer/index'
import reduxThunk from 'redux-thunk'
import {createLogger} from 'redux-logger'


let middleware = [reduxThunk]

if (process.env.NODE_ENV === 'development'){
    const logger = createLogger({
        collapsed:(state, action) => {return true}
    })
    middleware.push(logger)
}

const store = compose(applyMiddleware(...middleware))(createStore)(reducer)
 
export default store 