'use strict'
import React, {Component, PropTypes} from 'react' 
import {connect} from 'react-redux'

//css animation
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// import * as action from '../redux/action/index'
import '../resource/style/container.less'

//component
import QuesTitle from '../UIComponents/QuesTitle/QuesTitle'
import QuesAnswerText from '../UIComponents/QuesAnswerText/QuesAnswerText'
import QuesAnswerImg from '../UIComponents/QuesAnswerImg/QuesAnswerImg'

//action
import {getAllQuestion, uploadPartAnswer, seriseReSelected} from '../redux/action/questionTreeAction'
 

class Question extends Component{
    constructor(props){
        super(props)

        //当前已经有多个题目。但是不全显示。只有等于showindex的才可以编辑
        this.state = { 
            showIndex : 1 
        } 

        this.getAllQuestionFunc = this.getAllQuestionFunc.bind(this)
        this.answerClick = this.answerClick.bind(this) 

        this.dispatchNextQuestion = this.dispatchNextQuestion.bind(this)
    }    
 
    componentDidMount() { 
        this.getAllQuestionFunc()
    }
 
    componentWillReceiveProps(nextProps) {
        let {currentQuestion = []} = nextProps 
      
        this.setState({
            showIndex: currentQuestion.length 
        })
    } 
  
    /**
     * 获取所有题目  
     */
    getAllQuestionFunc() {
        let {dispatch, currentQuestion = []} = this.props 
        if(currentQuestion.length <= 0){
            dispatch(getAllQuestion('getAllQuestionnaire'))
        } 
    }

    /**
     * 点击选项的回调事件
     * @param {any} id 点击的选项id
     */
    answerClick(clickQuestion, choosedAnswers) {
        const _this = this
        const {currentQuestion = [] } = this.props   
        if(currentQuestion.length > 1 && clickQuestion.question.series_order == 1  && choosedAnswers[0].order == 1){
            let {dispatch} = this.props
            setTimeout(function() {
                _this.dispatchNextQuestion({ 
                    clickQuestion, 
                    choosedAnswers 
                }) 
            }, 500);

            dispatch(seriseReSelected({
                clickQuestion,
                choosedAnswers
            })) 
        }else{
            this.dispatchNextQuestion({ 
                clickQuestion, 
                choosedAnswers 
            }) 
        }  
    } 

    /** 
     * 提交已选答案
     * @param {any} opt  
     * @memberOf Question
     */
    dispatchNextQuestion(opt){   
        let {dispatch} = this.props
        dispatch(uploadPartAnswer('savePartAnswer', opt))
    }
  
    render(){   
        let {answerClick} = this 

        let AnswerComponent = <div/>
        let TitleComponent = <div/>   
        const {currentQuestion = [], questionAnswer=[]} = this.props   
        const _this = this

        const questionComponents = currentQuestion.map(function(quest){   
            //多选 
            let selectedAnswer = questionAnswer.find(function(item){
                return item.questionID == quest.question.id
            }) || {}
            

            //系列问题
            //默认显示 
            let clickAble = true

            if(quest.question.series && quest.question.series_order < _this.state.showIndex ){
                const lastAnswer = questionAnswer.filter(function (item) {
                    return item.questionID == currentQuestion[currentQuestion.length-1].question.id
                })
                if (lastAnswer.length <= 0){
                    // 小于则不可以点击
                    clickAble = false
                }
            }

            //题目
            if(quest.question && quest.question.content.length > 0){
                TitleComponent = <QuesTitle question={quest}/>
            }

            //选项  type=1：文字题。 type=2：图文题。  
            if (quest.answer && quest.answer.length > 0 && quest.answer[0].type === 1 ){
                AnswerComponent = <QuesAnswerText  clickAnswer={answerClick} selectedAnswer={selectedAnswer} clickAble={clickAble} question={quest}/>
            }else if(quest.answer && quest.answer.length > 0 && quest.answer[0].type === 2 ){ 
                AnswerComponent = <QuesAnswerImg clickAnswer={answerClick} selectedAnswer={selectedAnswer} clickAble={clickAble} question={quest}/>
            } 
 
            return (
                <div className='gt-container' key={quest.question.id}>
                    <div>
                        {TitleComponent} 
                        {AnswerComponent} 
                    </div> 
                </div> 
            )
        })

        return (
            <div>
                <ReactCSSTransitionGroup
                    transitionName="gt-answer"
                    component="div"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}> 

                    {questionComponents} 
                </ReactCSSTransitionGroup>
            </div>
        )    
    }
}   

Question.propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentQuestion: PropTypes.array.isRequired,
    questionAnswer: PropTypes.array.isRequired,
}
 
function mapStateToProps (state) {  
    let {currentQuestion, questionAnswer} = state.QuestionTreeReducer
    return {
        currentQuestion,
        questionAnswer
    }
} 
 
export default connect(mapStateToProps)(Question)