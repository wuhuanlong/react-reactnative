import React, {Component, PropTypes} from 'react'
import './QuesAnswerText.less'

import select_png from '../../resource/image/selected.png'
import QuestNextBtn from '../QuestNextBtn/QuestNextBtn'

import config from '../../client.config' 

class QuesAnswerText extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            chooses:[],
            can_click: true   //防止单选题重复点击，多选题点击下一步之后继续选择
        }
    }

    componentDidMount() {

        const {question, selectedAnswer} = this.props  
 
        if(selectedAnswer && selectedAnswer.choosedAnswer && selectedAnswer.choosedAnswer.length>0){
            let filter_answer = [] 

            for (const answer of question.answer) {
                let tempA = selectedAnswer.choosedAnswer.filter(function(selAnswerId){
                    return answer.id === selAnswerId
                })
                if(tempA.length>0){
                    filter_answer.push(answer)
                }
            } 
            
            this.setState({
                chooses: filter_answer
            })
        } 
    }
    

    componentWillReceiveProps(nextProps) { 
        // this.setState({
        //     can_click: true
        // })
    } 

    /**
     * 点击下一题
     */
    nextQuestion() { 
        const {question, clickAble, clickAnswer} = this.props 
        let filter_chooses =  this.state.chooses

        if (filter_chooses.length > 0){
            this.state.can_click && clickAble && clickAnswer( question, filter_chooses)

            //单选选择之后无法再点击
            this.setState({
                can_click: false
            })
        }
    }

    clickAnswerFunc(answer) { 
        const {question, clickAble, clickAnswer} = this.props 

        if(!clickAble){
            return
        }

        let filter_chooses =  this.state.chooses

        //如果是多选题，则不跳转。如果是单选题，则提交
        if(question.question.type == 2){ 
            if(answer.order == 1){
                // 如果选项是第一个。那么判断第一个是否选中，如果没选中，则选中。并清空别的选项
                const filter_order_1 = filter_chooses.filter(function(item){
                    return item.order == 1
                })
                if(filter_order_1.length > 0){
                    filter_chooses = [] 
                }else{
                    filter_chooses = []
                    filter_chooses.push(answer)
                }
            }else{
                //如果选中的不是第一个。那么判断是否有第一个选项，如果有则取消
                const _filter_chooses  = filter_chooses.filter(function(item){
                    return item.order != 1 
                }) 
                filter_chooses  = _filter_chooses.filter(function(item){
                    return item.id != answer.id
                }) 

                if(_filter_chooses.length == filter_chooses.length){
                    filter_chooses.push(answer)
                } 
            }
 
            this.setState({
                chooses: filter_chooses
            })

            return
        }else {
            filter_chooses = [answer]
            this.setState({ 
                chooses: filter_chooses
            })
        }
 
        this.state.can_click && clickAnswer( question, filter_chooses) 

        //单选选择之后无法再点击
        this.setState({
            can_click: false 
        })

    } 

    render() {
        const _this =  this
        const answerPrefixArr = config.answerPrefixArr 

        const {question} = this.props  
        let {chooses} = this.state
 
        //下一步按钮
        let nextBtnComponent = <div/> 
        if(question.question && question.question.type == 2 ){
            nextBtnComponent = <QuestNextBtn hintTitle='下一步' clickNext={_this.nextQuestion.bind(_this)}/>
        } 

        return (
            <div>
                <div className={'gt-answer-text'} >
                    { 
                        question.answer.map(function(answer, listIndex){ 
                            return(
                                <div className='gt-flex answer' key={listIndex} onClick={_this.clickAnswerFunc.bind(_this, answer)}>
                                    <p>{answerPrefixArr[answer.order - 1]}</p>
                                    {/*<p>{answer.id}</p>*/}
                                    <p className='gt-flex-item'>{answer.content}</p>
                                    {   
                                        <p className={chooses.filter(function(answerId){return answerId.id == answer.id}).length > 0 ? 'gt-show' : 'gt-hide'}>
                                            <img className="selected" src={select_png}/>
                                        </p> 
                                    }
                                </div>
                            )   
                        }) 
                    }
                </div>

                {nextBtnComponent}
            </div> 
        )
    }
}


QuesAnswerText.defaultProps = { 
    question: {}
}

QuesAnswerText.propTypes = { 
    question: PropTypes.object.isRequired,
    clickAnswer: PropTypes.func.isRequired,
    selectedAnswer: PropTypes.object,
    clickAble: PropTypes.bool 
}

export default QuesAnswerText;