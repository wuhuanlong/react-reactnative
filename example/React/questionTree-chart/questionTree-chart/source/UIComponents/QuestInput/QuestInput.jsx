import React, {Component, PropTypes} from 'react';
import './QuestNextBtn.less'

class Button extends Component {
    constructor(props) {
        super(props);
    } 

    render() { 
        const {hintTitle, clickNext} = this.props
        return (
            <div className='gt-btn__next'>
                <p onClick={clickNext}>{hintTitle}</p>
            </div>
        ) 
    }
} 
Button.propTypes = {
    hintTitle: PropTypes.string.isRequired, 
    clickNext: PropTypes.func.isRequired
}


export default Button;