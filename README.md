# ReactNative 入门文档
> 目录大纲

## React 简介
    1.React基本语法用法
    2.React-redux用法

## 同行对比
    1.Cordova PK ReactNative
    2.Weex PK ReactNative

## ReactNative 简介 
    1.ReactNative 环境搭建
    2.运行HelloWorld
    3.ReactNative常见坑及注意事项
    4.ReactNative与原生交互
---------------------

> React 简介
1. React基本语法用法
    ```jsx
    // es6方式
    export class HelloWorld extends Component { 
        constructor(props) {
            super(props); 
            // 设置 initial state
            this.state = {}; 
            // ES6 类中函数必须手动绑定
            // this.handleChange = this.handleChange.bind(this);
        }
        render() {
            const {name} = this.props 
            return (
                <h1>Hello {name}</h1>
            )
        }
    } 
    ReactDOM.render(
        <HelloWorld name="Thinkive" />,
        document.getElementById('domid')
    );
    ```
    React 创建组件的方式有3种，另2种创建的方式
    ```jsx
    // es5 方式
    var HelloWorld = React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function() {
            return <h1>Hello {this.props.name}</h1>;
        }
    });
    ```
    ```jsx
    // 无状态函数方式
    function HelloWorld(props, /* context */) {
        return <div>Hello {props.name}</div>
    }
    ```
    - React.Component创建的组件，其成员函数不会自动绑定this，需要开发者手动绑定，否则this不能获取当前组件实例对象
    - React.createClass创建的组件，其每一个成员函数的this都有React自动绑定，任何时候使用，直接使用this.method即可，函数中的this会被正确设置
    - 组件不会被实例化，整体渲染性能得到提升,但是组件不能访问this对象，没有生命周期，无状态组件只能访问输入的props，同样的props会得到同样的渲染结果，不会有副作用
-----------------------
2. React生命周期
    ```jsx
    - componentWillMount()
    - componentDidMount()
    - componentWillUpdate(object nextProps, object nextState)
    - componentDidUpdate(object prevProps, object prevState)
    - componentWillUnmount()
    - componentWillReceiveProps(object nextProps) //已加载组件收到新的参数时调用
    - shouldComponentUpdate(object nextProps, object nextState)//组件判断是否重新渲染时调用
    ```

    ### Mounting
    ```jsx
    constructor()
    componentWillMount()
    render()
    componentDidMount()
    ```
    ### Updating
    ```jsx
    componentWillReceiveProps()
    shouldComponentUpdate()
    componentWillUpdate()
    render()
    componentDidUpdate()
    ```
    ### Unmounting
    ```jsx
    componentWillUnmount()
    ```
    ### Error Handling
    ```jsx
    componentDidCatch()
    ```
    ### Other APIs
    ```jsx
    setState();
    forceUpdate(callback)
    ```
--------------------------
> React-redux 用法
+ 将所有组件分成两大类：
    + UI 组件（presentational component）
        - 只负责 UI 的呈现，不带有任何业务逻辑
        - 没有状态（即不使用this.state这个变量）
        - 所有数据都由参数（this.props）提供
        - 不使用任何 Redux 的 API
    + 容器组件（container component）
        - 负责管理数据和业务逻辑，不负责 UI 的呈现
        - 带有内部状态
        - 使用 Redux 的 API
- React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。
1. Connect()
    ```jsx
    import { connect } from 'react-redux' 
    const VisibleTodoList = connect(
        mapStateToProps,
        mapDispatchToProps
    )(TodoList)
    ```
    mapStateToProps是一个函数。它的作用就是像它的名字那样，建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系。
    ```js
    import { connect } from 'react-redux' 
    //mapStateToProps会订阅 Store，每当state更新的时候，就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
    //mapStateToProps的第一个参数总是state对象，还可以使用第二个参数，代表容器组件的props对象。
    const mapStateToProps = (state, ownProps) => {
    const {todos, visibilityFilter} = state
        return {
            todos: getVisibleTodos(todos, visibilityFilter)
        }
    }
    // 做一些过滤匹配动作，与VUEX的getters一致
    const getVisibleTodos = (todos, filter) => {
        switch (filter) {
            case 'SHOW_ALL':
                return todos
            case 'SHOW_COMPLETED':
                return todos.filter(t => t.completed)
            case 'SHOW_ACTIVE':
                return todos.filter(t => !t.completed)
            default:
                throw new Error('Unknown filter: ' + filter)
    }
    }

    const VisibleTodoList = connect(
        mapStateToProps 
    )(TodoList)
    ```
    mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射。也就是说，它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。
    ```jsx
    // 函数类型
    const mapDispatchToProps = (dispatch, ownProps) => {
        return {
            onClick: () => {
                dispatch({
                    type: 'SET_VISIBILITY_FILTER',
                    filter: ownProps.filter
                });
            }
        };
    }

    // 对象类型
    const mapDispatchToProps = {
        onClick: (filter) => {
            type: 'SET_VISIBILITY_FILTER',
            filter: filter
        };
    }
    ```
-----------------------
2. Provider 组件
  - 容器组件可能在很深的层级，一级级将state传下去就很麻烦。 React-Redux 提供Provider组件，可以让容器组件拿到state
  ```jsx
    import { Provider } from 'react-redux'
    import { createStore } from 'redux'
    import todoApp from './reducers'
    import App from './components/App'

    let store = createStore(todoApp);//创建store的生成函数

    render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    )
  ```
  上面代码中，Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。
  ```jsx
    export class VisibleTodoList extends Component {
        componentDidMount() {
            const { store } = this.context;

            // redux 中 store 的监听方法：subscribe 类似于vue里的watch
            this.unsubscribe = store.subscribe(() =>
                this.forceUpdate()
            );
        }

        render() {
            const props = this.props;
            const { store } = this.context;
            const state = store.getState();
            // TODO
            return ()
        }
    }

    VisibleTodoList.contextTypes = {
        store: React.PropTypes.object
    }
  ```
-----------------------
3. dispatch
  - store
    ```jsx
        import {createStore, applyMiddleware, compose} from 'redux'
        import reducer from '../reducer/index' 
        import reduxThunk from 'redux-thunk' // redux 异步分发的插件
        import {createLogger} from 'redux-logger' // 浏览器插件能够在浏览器控制台打印store的state更改信息

        let middleware = [reduxThunk]

        // 开发模式时打印state change日志
        if (process.env.NODE_ENV === 'development'){
            const logger = createLogger({
                collapsed:(state, action) => {return true}
            })
            middleware.push(logger)
        }

        // 创建store
        const store = compose(applyMiddleware(...middleware))(createStore)(reducer)
        
        export default store 
    ```
  - action
    - 用来定义dispatch的类型，以及传递的参数
    ```jsx
    /* action.js */

    // 使用 redux-thunk 插件之后可以调用异步执行函数
    export const uploadAll = (url, callback) => { 
        fetch(url).then((response) => {
            // TODO
            callback && callback(response)
        }).then((data) => {
            console.log(data);
        }).catch((e) => {
            console.log("uploadAll, error");
        });
    }

    // 未使用 redux-thunk 插件之只能调用同步执行函数
    export const KChangeNeekData = '更改State neek的数据'
    export const changeAll = (payload) => {
        return {
            type:KChangeNeekData,
            payload
        } 
    }
    ```
    ```jsx
    import {uploadAll, changeAll} from '@module/redux/action'
    
    const {dispatch} = this.props 

    // 使用 redux-thunk 插件之后可以调用异步执行函数 
    dispatch(uploadAll('http://www.thinkive.com/', (response) => {
        // TODO
    })) 

    // 未使用 redux-thunk 插件之只能调用同步执行函数
    dispatch(changeAll({
        neek: 'Hello Thinkive !'
    })) 
    ```
    
  - reducer 
  ```jsx
    import {uploadAll, changeAll} from '@module/redux/action'

    const init_State = {
        neek: '' // init State
    }
 
    /************   reducer     ***************/ 
    /**
    * reducer 与ajax的状态有关的reducer
    * @param {*} state
    * @param {*} action
    */
    export const init_Reducer = (state = init_State, action = {}) => {
        const { payload: {neek} } = action
        let newState = Object.assign({}, state) 
        switch (action.type) {
        case KChangeNeekData:
            return newState['neek'] = neek 
        default:
            return state
        }
    }
  ```
-------------------

> 同行对比
- 优势:
    - Cordova 为代表的 Hybrid 是基于 WebView 的，在 Android 上的性能缺陷非常明显; 而 RN 是利用 JSCore 转化成 Native 运行的，性能相对好很多
    - Weex 文档少, 活跃度没有ReactNative高, 疑似阿里的KPI项目, 已经很久没有更新版本了, 而且开发中遇到的坑比较多, 同一份代码在安卓和iOS上运行差异比较大; 而RN自2015至今有近3年的社区贡献, 开发过程中坑比较少, 文档比较齐全, 社区活跃
- 劣势: 
    - Weex使用一套Vue代码就可以解决Native端, Web端的项目开发, 而目前RN的代码只能运行在Native端, 在Chrome浏览器只能调试
    - 相对于Weex而言, Vue的语法相对简单, React使用jsx的语法糖, 比较不容易上手
- 混合开发通病:
    - 由于经常需要开发与原生交互的组件或者API, 往往开发人员需要熟悉或了解原生iOS或Android的开发
    - RN 需要从服务器下载 JS bundle，然后在本地转化成 Native code 运行的，所以在第一次打开 App 时需要花费一些时间进行下载和刷新。一般行业解决方案就是固定不变的依赖包缓存在原生中, 业务逻辑从服务器下载后转换, 过程中添加 Lanch Screen 来过度