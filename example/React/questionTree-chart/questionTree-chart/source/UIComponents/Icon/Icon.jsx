import React, {Component, PropTypes} from 'react';
import './Icon.less'

class Icon extends Component {
    constructor(props) {
        super(props);
    } 

    render() {
        let className = 'iconfont icon-' + this.props.type + ' ' + this.props.className;
        return (<i className={className} style={this.props.style} onClick={this.props.onClick}>
        </i>)
    }
}

Icon.defaultProps = {
    className: '',
    type: '',
    style: null,
    onClick: null
}

Icon.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    style: PropTypes.object,
    onClick: PropTypes.func
}


export default Icon;