import React from 'react'
import {Router, Route, Redirect, IndexRoute} from 'react-router' 
import {history} from '../history/index'

import questionModel1 from '../components/Application' 

//刷新时，清空所有session保存的历史state
// import local from '../utils/storage' 
// local.session.delAll()

const routerConf = (
    <Router history = {history}>
        <Route path="/questionTree2/" component={questionModel1}>
            <IndexRoute component={questionModel1}/>
        </Route>
        <Redirect from='*' to='/questionTree2/'></Redirect>
    </Router>
)

export default routerConf