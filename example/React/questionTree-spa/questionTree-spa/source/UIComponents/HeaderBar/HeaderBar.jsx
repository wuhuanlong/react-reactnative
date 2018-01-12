import React, {Component, PropTypes} from 'react'
import './HeaderBar.less'

class HeaderBar extends Component {
    constructor(props) {
        super(props)
    } 
    render() {
        return (
            <div className={`gt-headerBar-header-container ${this.props.className}`}>
                <div className='gt-headerBar-left-container'>
                    {this.props.leftElement}
                </div>
                <h3 className='gt-headerBar-header-title'>
                    {this.props.title}
                </h3>
                <div className='gt-headerBar-right-container'>
                    {this.props.rightElement}
                </div>
            </div>
        )
    }
}


HeaderBar.defaultProps = {
    title: '',
    rightElement: null,
    leftElement: null,
    className: ''
}

HeaderBar.propTypes = {
    title: PropTypes.string.isRequired,
    rightElement: PropTypes.element,
    leftElement: PropTypes.element,
    className: PropTypes.string
}

export default HeaderBar;