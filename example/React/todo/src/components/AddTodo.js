import React, { Component, PropTypes } from 'react';
import { addTodo } from 'actions/todos';

export default class AddTodo extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    console.log(nextState);
    return false;
  }

  addTodo(e) {
    e.preventDefault();
    const input = this.refs.todo;
    const value = input.value.trim();
    if (value) {
      this.props.dispatch(addTodo(value));
      input.value = '';
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.addTodo(e)}>
          <input className="form-control" type="text" placeholder="输入..., Enter提交" ref="todo"/>
        </form>
        <br/>
      </div>
    );
  }
}
