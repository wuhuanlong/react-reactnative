'use strict'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux' 

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

        this.allQuestDone = this.allQuestDone.bind(this)

        this.onBackHomeClick = this.onBackHomeClick.bind(this)
        this.onShareClick = this.onShareClick.bind(this)

        this.routerChange = this.routerChange.bind(this)
        this.wxConfFunc = this.wxConfFunc.bind(this)
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return nextProps.currentStep !== this.props.currentStep ||
    //             nextProps.totalStep !== this.props.totalStep ||
    //             (nextProps.checkResult && nextProps.checkResult.picUrl !== this.props.checkResult.picUrl)
    // }

    componentDidMount() {
        this.wxConfFunc()

        const _this = this
        //history.listen 中不可以用dispatch。违反纯函数的概念，不被允许
        window.addEventListener('hashchange', () => {
            _this.routerChange()
        })

        window.addEventListener("orientationchange", function(event) {
            // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
            _this.routerChange()
        }, false);

        //判断手机横竖屏状态：
        function hengshuping(){
            _this.routerChange()
        }
        window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", hengshuping, false);
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
     * 返回首页
     */
    onBackHomeClick() {
        window.location.href = config.redicatePath
    }

    /**
     * 分享
     */
    onShareClick() {
        window.wx.showOptionMenu()
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

    /**
     * 提交已选答案
     * @memberOf Application
     */
    allQuestDone() {
        let {dispatch} = this.props
        const _this = this
        setTimeout(function () {
            dispatch(uploadAllAnswer('saveAllAnswer'))
        }, 500)
    }

    render() {
        const {currentStep, totalStep, checkResult} = this.props
        const {resetWrite, goBeforeQuestion, onShareClick, onBackHomeClick} = this

        let contentComponent = <div/>


        if (currentStep > totalStep) {
            if (checkResult && checkResult.picUrl.length>0) {

                const resultPicUrl = checkResult.picUrl

                contentComponent = <div className='gt-result-content'>
                    <p className='gt-quest-title'>您的金融画像在古代是......</p>
                    <img src={resultPicUrl}/>
                    <footer className='gt-result-footer'>
                        <p onClick={onShareClick}>分享画像</p>
                        <p onClick={onBackHomeClick}>查看产品</p>
                    </footer>
                </div>
            } else {
                // this.allQuestDone()
                contentComponent = <div className='gt-result-content'>
                    <p className='gt-quest-title'>您的金融画像在古代是......</p>
                    <img src={config.PublicPath + 'static/questionTree2/images/scanf.gif'}/>
                </div>
            }
        } else {
            contentComponent = <Question/>
        }

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
    totalStep: 0,
    checkResult: {}
}

Application.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalStep: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    checkResult: PropTypes.object
}

export default connect((state) => {
    let {currentStep, totalStep, checkResult} = state.QuestionTreeReducer
    return {
        currentStep,
        totalStep,
        checkResult
    }
})(Application) 