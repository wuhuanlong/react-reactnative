import React, { PropTypes } from 'react';
import { deleteAllTodos, changeFilter } from 'actions/todos';
import PureComponent from './PureComponent';
import cn from 'classnames';

export default class Footer extends PureComponent {

  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  filters = ['全部', '已完成', '未完成']

  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <div className="btn-group">
          {this.filters.map(filter => {
            const className = cn('btn btn-default capitalize', {
              active: this.props.activeFilter === filter,
            });
            return (
              <button key={filter} className={className} onClick={() => dispatch(changeFilter(filter))}>
                {filter}
              </button>
            );
          })}
        </div>
        <div className="pull-right">
          <button className="btn btn-danger" onClick={() => dispatch(deleteAllTodos())}>删除全部</button>
        </div>
      </div>
    );
  }
}
