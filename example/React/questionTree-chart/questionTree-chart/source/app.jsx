'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import route from './router/index'
import {Provider} from 'react-redux'
import store from './redux/store/index'

//css reset
import './resource/style/reset.less' 

// plugin
import clickTools from './utils/clickTools'
console.log(clickTools)

// store.subscribe(()=>{
//     console.log('subscribe')
//     console.log(store.getState().QuestionTreeReducer)
// })

ReactDom.render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.getElementById('react-application')
)