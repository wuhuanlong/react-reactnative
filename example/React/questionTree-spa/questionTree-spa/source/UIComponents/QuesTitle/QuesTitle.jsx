import React, {Component, PropTypes} from 'react'
import './QuesTitle.less'

class QuesTitle extends Component {
    constructor(props) {
        super(props)
    } 
    render() {
        let prefix = 'Q'
        
        const {question} =  this.props
        if(question.question.order <10){
            prefix = 'Q0'
        }

        return ( 
            <p className={'gt-quest-title'} >
                <span>{prefix}{question.question.order}.</span>{question.question.content}
            </p>
        )
    }
}  
QuesTitle.propTypes = { 
    question: PropTypes.object.isRequired 
}

export default QuesTitle;