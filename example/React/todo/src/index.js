import React, { PropTypes } from 'react';
import { render } from 'react-dom';
// react render
render(
  <h1>hello thinkive</h1>,
  document.getElementById('todo')
);


// // react functional components
// const FuncComponents = () => {
//   return <h1>hello react functional components</h1>;
// };
// render(
//   <FuncComponents />,
//   document.getElementById('todo')
// );


// //react ES5 components
// const CreateComponents = React.createClass({ 
//   getInitialState() { 
//     console.log('getInitialState')
//     return {
//       greet: 'hello',
//     }
//   },
//   componentDidMount() { 
//     console.log('componentDidMount')
//   }, 
//   render() {
//     const { name } = this.props;
//     const { greet } = this.state;
//     return <h1>{greet} {name}</h1>;
//   }
// });

// CreateComponents.propTypes = {
//   name: PropTypes.string,
// };
// CreateComponents.defaultProps = {
//   name: 'defaultName',
// };

// render(
//   <CreateComponents/>,
//   document.getElementById('todo')
// );


// //react extended components 
// class ExtendsComponents extends React.Component {
//   static propTypes = {
//     nick: PropTypes.string.isRequired,
//     culTimeStrap: PropTypes.any,
//   }

//   constructor(props) {
//     super(props);
//     this.state = {
//       greet: 'hello',
//     };
//   }

//   render() {
//     const { greet } = this.state;
//     const { nick, culTimeStrap } = this.props;
//     return (
//       <h1>{culTimeStrap} : {greet} {nick}</h1>
//     );
//   }
// }

// const getCulTimeStrap = () => {
//   const culDate = new Date;
//   return `${culDate.getFullYear()}/${culDate.getMonth() + 1}/${culDate.getDate()}`;
// };

// render(
//   <ExtendsComponents nick="thinkive" culTimeStrap={getCulTimeStrap()}/>,
//   document.getElementById('todo')
// );


// // react-redux
// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import App from './components/App';
// import rootReducer from './reducers';
// import 'styles/app.scss';
// import 'bootstrap/dist/css/bootstrap.css';

// const store = createStore(rootReducer);
/* render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('todo')
);*/
