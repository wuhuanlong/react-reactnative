'use strict'
import 'babel-polyfill'
import React from 'react'
import ReactDom from 'react-dom'
import route from './router/index'
import {Provider} from 'react-redux'
import store from './redux/store/index'

//css reset
import './resource/style/reset.less' 


// 对于支持屏幕锁定的强制竖屏
// window.screen && 
// window.screen.orientation && 
// window.screen.orientation.lock && 
// window.screen.lock("portrait-primary"); 


ReactDom.render(
    <Provider store={store}>
        {route}
    </Provider>,
    document.getElementById('react-application')
)