'use strict'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
// import * as action from '../redux/action/baseAction'

//component
import HeaderBar from '../UIComponents/HeaderBar/HeaderBar'
import Process from '../UIComponents/Process/Process'
import Icon from '../UIComponents/Icon/Icon'
import Question from './Question'

//action
import {
    beforeQuestion,
    resetQuestion,
    uploadAllAnswer,
    renderStateFromHistory,
    seriseGoBack,
    getWxConf
} from '../redux/action/questionTreeAction'

//config
import config from '../client.config'

//history
import {history} from '../history/index'

class Application extends Component {
    constructor(props) {
        super(props)
        this.resetWrite = this.resetWrite.bind(this)
        this.goBeforeQuestion = this.goBeforeQuestion.bind(this)

        this.routerChange = this.routerChange.bind(this)
        this.wxConfFunc = this.wxConfFunc.bind(this)
    }

    componentDidMount() {
        this.wxConfFunc()

        const _this = this
        //history.listen 中不可以用dispatch。违反纯函数的概念，不被允许
        window.addEventListener('hashchange', () => {
            _this.routerChange()
        })

        window.addEventListener("orientationchange", function(event) {
            // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
            if(event.orientation === 0 || event.orientation === 90 || event.orientation === 180 || event.orientation === 270){
                _this.routerChange()
            } 
        }, false);

        //判断手机横竖屏状态：
        function hengshuping(){
            _this.routerChange()
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false); 
    } 

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentStep !== this.props.currentStep || nextProps.totalStep !== this.props.totalStep
    }
    

    wxConfFunc() {
        let {dispatch} = this.props

        dispatch(getWxConf(
            'getSign',
            {url:  window.location.href.split('#')[0]},
            (result) => {
                window.wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: config.wxAppId, // 必填，公众号的唯一标识
                    timestamp: result.timestamp, // 必填，生成签名的时间戳
                    nonceStr: result.noncestr, // 必填，生成签名的随机串
                    signature: result.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                })
                window.wx.ready(function () {
                    window.wx.onMenuShareTimeline({
                        title: '我的金融画像', // 分享标题
                        link: window.location.href, // 分享链接,将当前登录用户转为puid,以便于发展下线
                        imgUrl: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1076153735,1607433053&fm=58', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('分享成功')
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    })
                    window.wx.onMenuShareAppMessage({
                        title: '我的金融画像', // 分享标题
                        desc:' ',
                        link: window.location.href, // 分享链接,将当前登录用户转为puid,以便于发展下线
                        imgUrl: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1076153735,1607433053&fm=58', // 分享图标
                        success: function () {
                            // 用户确认分享后执行的回调函数
                            alert('分享成功')
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    })
                })
                window.wx.error(function (res) {
                })
            }
        ))
    }

    /**
     * router改变
     * @memberOf Application
     */
    routerChange() {
        let {dispatch} = this.props
        const location = history.getCurrentLocation()
        if (location.state && location.state.historyState) {
            dispatch(renderStateFromHistory(location.state.historyState))
        }
    }

    /**
     * 重新测评
     * @memberOf Application
     */
    resetWrite() {
        let {dispatch} = this.props
        dispatch(resetQuestion())
    }

    /**
     * 返回上一题
     * @memberOf Application
     */
    goBeforeQuestion() {
        let {dispatch} = this.props
        dispatch(beforeQuestion())
    } 

    render() {
        const {currentStep, totalStep} = this.props
        const {resetWrite, goBeforeQuestion} = this
 
        let contentComponent = <Question /> 

        return (
            <div>
                <HeaderBar
                    title='金融画像'
                    leftElement={<div style={{textAlign: 'left', paddingLeft: (20 / 75) + 'rem'}}
                                      onClick={goBeforeQuestion}>
                        <Icon type="back" className="gt-changeUser-backIcon"/>
                        {/*<p className="gt-changeUser-backIcon">返回</p>*/}
                    </div>}

                    rightElement={<div style={{textAlign: 'right', paddingRight: (20 / 75) + 'rem'}}
                                       onClick={resetWrite}>
                        <p className="gt-rightIcon">重新测评</p>
                    </div>}
                />
                <Process active={currentStep > totalStep ? totalStep : currentStep} total={totalStep}/>

                {contentComponent}

                {/*预加载图片，http缓存*/}
                <img style={{display:'none'}} src={config.PublicPath + 'static/questionTree2/images/scanf.gif'}/>
            </div>
        )
    }
}

Application.defaultProps = {
    currentStep: 0,
    totalStep: 0
}

Application.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalStep: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default connect((state) => {
    let {currentStep, totalStep} = state.QuestionTreeReducer
    return {
        currentStep,
        totalStep
    }
})(Application) 