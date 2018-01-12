import React, {Component, PropTypes} from 'react'
import './HeaderBar.less'

class HeaderBar extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.title !== this.props.title ||
            nextProps.rightElement !== this.props.rightElement ||
            nextProps.leftElement !== this.props.leftElement ||
            nextProps.className !== this.props.className
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