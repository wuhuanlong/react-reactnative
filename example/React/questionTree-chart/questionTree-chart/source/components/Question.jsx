'use strict'
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

// import * as action from '../redux/action/index'
import '../resource/style/container.less'

import '../utils/requestAnimationFrameUtils'

//css animation
import QueueAnim from 'rc-queue-anim' 

//component
import QuesTitle from '../UIComponents/QuesTitle/QuesTitle'
import QuesAnswerText from '../UIComponents/QuesAnswerText/QuesAnswerText'
import QuesAnswerImg from '../UIComponents/QuesAnswerImg/QuesAnswerImg'

//action
import {getAllQuestion, uploadPartAnswer, seriseReSelected} from '../redux/action/questionTreeAction'

//config
import config from '../client.config'

const initOffset = window.screen.availWidth * 3

const body = document.getElementsByTagName('body')[0]
// const body = document.getElementById('react-application')
class Question extends Component {
    constructor(props) {
        super(props)

        //当前已经有多个题目。但是不全显示。只有等于showindex的才可以编辑
        this.state = {
            firstRender:true
        }

        this.getAllQuestionFunc = this.getAllQuestionFunc.bind(this)
        this.answerClick = this.answerClick.bind(this)

        this.dispatchNextQuestion = this.dispatchNextQuestion.bind(this)

        this.onBackHomeClick = this.onBackHomeClick.bind(this)
        this.onShareClick = this.onShareClick.bind(this)
    }

    componentDidMount() {
        this.getAllQuestionFunc()  
    }

    componentDidUpdate(prevProps, prevState) { 
        const _this = this

        if (body.scrollHeight - body.scrollTop > 12/10*body.clientHeight){
            body.scrollTop += body.scrollHeight - body.scrollTop
        }else{
            setTimeout(function() {
                function scrollStep (timestamp) {
                    body.scrollTop += 15
                    if (body.scrollTop + body.clientHeight < body.scrollHeight - 5) {
                        window.requestAnimationFrame(scrollStep);
                    }
                }
                window.requestAnimationFrame(scrollStep)
            }, 500)
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
     * 获取所有题目
     */
    getAllQuestionFunc() {
        let {dispatch, currentQuestion = []} = this.props
        if (currentQuestion.length <= 0) {
            dispatch(getAllQuestion('getAllQuestionnaire'))
        }
    }

    /**
     * 点击选项的回调事件
     * @param {any} id 点击的选项id
     */
    answerClick(clickQuestion, choosedAnswers) {
        this.dispatchNextQuestion({
            clickQuestion,
            choosedAnswers
        })
    }

    /**
     * 提交已选答案
     * @param {any} opt
     * @memberOf Question
     */
    dispatchNextQuestion(opt) {
        let {dispatch} = this.props
        dispatch(uploadPartAnswer('savePartAnswer', opt))
    }

    render() {
        const _this = this
        let {answerClick, onShareClick, onBackHomeClick} = this

        let AnswerComponent = <div/>
        let TitleComponent = <div/>
        const {currentQuestion = [], questionAnswer = []} = this.props

        const questionComponents = currentQuestion.map(function (quest, questIndex) { 
            if(quest.isResult){
                let imgCont = <img src={quest.result.picUrl}/>
                let menuBtn = <div className="gt-result-menu gt-flex"> <p className="gt-flex-item" onClick={onShareClick}>分享画像</p> <p className="gt-flex-item" onClick={onBackHomeClick}>查看产品</p></div>
                if (quest.result.waiting){
                    imgCont = <img src={config.PublicPath + 'static/questionTree2/images/scanf.gif'}/>
                    menuBtn = <div/>
                }
                return(
                    <div className='gt-container'  key={questIndex}>  
                        <QueueAnim  
                            animConfig={[
                                [{opacity:1, x:[0, -initOffset], duration:500, delay:300}],
                                [{opacity:0, x:[0, initOffset], duration:500, delay:300}]
                            ]}> 
                                <div className="gt-result" key={`system${questIndex}`} >
                                    {imgCont}
                                    {menuBtn}
                                </div> 
                        </QueueAnim>  
                    </div>
                )
            } else if(quest.isSystem){
                return(  
                    <div className='gt-container'  key={questIndex}>  
                        <QueueAnim  
                            animConfig={[
                                [{opacity:1, x:[0, -initOffset], duration:500, delay:300}],
                                [{opacity:1, x:[0, initOffset], duration:500, delay:300}]
                            ]}> 
                                <div className="gt-system-msg" key={`system${questIndex}`} >  
                                    <p>{quest.systemMsg}</p> 
                                </div> 
                        </QueueAnim>  
                    </div>
                )
            }  else if(quest.isReply){
                return(
                    <div className='gt-container'  key={questIndex}> 
                        <div className='gt-answer-options'>
                            <QueueAnim  
                                animConfig={[
                                    [{opacity:1, x:[0, initOffset], duration:500, delay:300}],
                                    [{opacity:1, x:[0, -initOffset], duration:500, delay:300}]
                                ]}>  
                                    <div className="gt-answer-reply" key={`reply${questIndex}`} >  
                                        <p>{quest.reply}</p> 
                                    </div> 
                            </QueueAnim>  
                        </div>
                    </div>
                )
            }else{  

                //多选 
                let selectedAnswer = questionAnswer.find(function (item) {
                        return item.questionID === quest.question.id
                }) || {}
                
                //默认显示 
                let clickAble = true 
                if ( questIndex < currentQuestion.length-1) {
                    const lastAnswer = questionAnswer.filter(function (item) {
                        return item.questionID === currentQuestion[currentQuestion.length - 1].question.id
                    })
                    if (lastAnswer.length <= 0) {
                        // 小于则不可以点击
                        clickAble = false
                    }
                }

                //题目
                if (quest.question && quest.question.content.length > 0) {
                    TitleComponent = <QuesTitle question={quest} key={`title${questIndex}`}/>
                }

                const {answer} = quest
                //选项  type=1：文字题。 type=2：图文题。  
                if (answer && answer.length > 0 && answer[0].type === 1) {
                    AnswerComponent = <QuesAnswerText
                                        key={`questionText${questIndex}`}
                                        clickAnswer={answerClick} 
                                        selectedAnswer={selectedAnswer} 
                                        clickAble={clickAble} 
                                        question={quest} />
                } else if (answer && answer.length > 0 && answer[0].type === 2) {
                    AnswerComponent = <QuesAnswerImg
                                        key={`questionImg${questIndex}`}
                                        clickAnswer={answerClick} 
                                        selectedAnswer={selectedAnswer} 
                                        clickAble={clickAble} 
                                        question={quest} />
                }
    
                return (
                    <div className='gt-container' key={questIndex}>
                        <div> 
                            <QueueAnim  
                                animConfig={[
                                    [{opacity:1, x:[0, -initOffset], duration:500, delay:500}]
                                ]}> 
                                    {TitleComponent}   
                            </QueueAnim> 

                            <div className="gt-answer-options"> 
                                {AnswerComponent}   
                            </div>
                        </div>
                    </div>
                )
            }
        })

        return (   
            <div className='gt-anim' >
                {questionComponents}
            </div>   
        )
    }
}

Question.propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentQuestion: PropTypes.array.isRequired,
    questionAnswer: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
    let {currentQuestion, questionAnswer} = state.QuestionTreeReducer
    return {
        currentQuestion,
        questionAnswer
    }
}

export default connect(mapStateToProps)(Question)