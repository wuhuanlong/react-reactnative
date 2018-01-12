import React from 'react'
import {Router, Route, Redirect, IndexRoute } from 'react-router' 
import {history} from '../history/index'

import questionModel1 from '../components/Application'  

const routerConf = (
    <Router history = {history}>
        <Route path="/questionTree/" component={questionModel1}>
            <IndexRoute component={questionModel1}/>
        </Route>

        <Redirect from='*' to='/questionTree/'></Redirect>
    </Router>
)

export default routerConf