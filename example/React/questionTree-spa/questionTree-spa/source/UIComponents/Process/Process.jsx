import React, {Component, PropTypes} from 'react';
import './Process.less';

class Process extends Component {
    constructor(props) {
        super(props);
    } 

    render() {
        return (
            <div className='gt-process-container'>
                <div className='gt-process-active' style={{width: (this.props.active / this.props.total) * 100 + '%'}}>
                </div>
            </div>
        )
    }
}

Process.defaultProps = {
    active: 20,
    total: 100
};

Process.propTypes = {
    active: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
};

export default Process;