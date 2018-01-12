import React, {Component, PropTypes} from 'react'
import './QuesAnswerImg.less'

import config from '../../client.config'

class QuesAnswerImg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chooses:[],
            answersMap:[],
            can_click: true,   //防止单选题重复点击，多选题点击下一步之后继续选择
            orientation:'portrait'
        }
        this.getOrientation = this.getOrientation.bind(this)
        this.initData = this.initData.bind(this)
    }

    getOrientation() {
        let orientation = this.state.orientation
        if (window.orientation === 90 || window.orientation === 270 ){
            orientation = 'landscape'
        }else{
            orientation = 'portrait'
        }
        return orientation
    }

    componentDidMount() {
        this.initData()
    }

    componentWillReceiveProps() {
        this.initData()
    }

    initData() {
        const {answer} = this.props.question

        let tempArr = []

        let answersMapCopy = []
        let answerTemp = Object.assign([], answer)

        let totalRows = 2
        let orientation = this.getOrientation()
        if (orientation == 'landscape'){
            totalRows = 3
        }else{
            totalRows = 2
        }

        if(answerTemp.length % totalRows !== 0){
            for (let i= 1; i < totalRows; i++){
                answerTemp.push({order:answerTemp.length　+　i})
            }
        }
        for (const item of answerTemp) {
            tempArr.push(item)
            if (item.order % totalRows === 0){
                answersMapCopy.push(tempArr)
                tempArr = []
            }
        }


        const {question, selectedAnswer} = this.props
        let filter_answer = []
        if(selectedAnswer && selectedAnswer.choosedAnswer && selectedAnswer.choosedAnswer.length>0){
            for (const answer of question.answer) {
                let tempA = selectedAnswer.choosedAnswer.filter(function(selAnswerId){
                    return answer.id === selAnswerId
                })
                if(tempA.length>0){
                    filter_answer.push(answer)
                }
            }
        }
        this.setState({
            answersMap: answersMapCopy,
            chooses: filter_answer,
            orientation
        })
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

        this.state.can_click && clickAnswer(question, filter_chooses) 
         //单选选择之后无法再点击
        this.setState({
            can_click: false 
        })
    }

    render() {
        const _this =  this 
        const answerPrefixArr = config.answerPrefixArr   
         
        const {chooses, answersMap} = this.state

        return (
            <div>
                <div>
                    { 
                        answersMap.map(function(answerList, listIndex){
                            return (
                                <div key={listIndex} className='gt-flex'>
                                    {
                                        answerList.map(function(answer, index){
                                            if(answer.content){
                                                const answerText = answer.content.split('|')[0]
                                                const answerImgSrc = answer.content.split('|')[1]

                                                let classNameCustom = 'gt-flex-item aligh-center'
                                                if (index %2 === 1 && _this.state.orientation == 'portrait'){
                                                    classNameCustom = 'gt-flex-item align-right'
                                                }


                                                let classNameAnswer = 'gt-answer-answer'
                                                if(chooses.filter(function(answerId){return answerId.id === answer.id}).length > 0){
                                                    classNameAnswer = 'gt-answer-answer selected'
                                                }


                                                return(
                                                    <div className={classNameCustom}  
                                                        key={index} 
                                                        onClick={_this.clickAnswerFunc.bind(_this, answer)}>
                                                        <div className={classNameAnswer}>
                                                            <p>{answerPrefixArr[answer.order - 1]}{answerText}</p>
                                                            {/*<p>{answer.id}{answerText}</p> */}
                                                            <img src={answerImgSrc}/>
                                                        </div>
                                                    </div>
                                                )
                                            } else{
                                                return(
                                                    <div className='gt-flex-item gt-unVisable' key={index}>
                                                        <div className="gt-answer-answer"></div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            )
                        }) 
                    }
                </div>
            </div>
        )
    }
}


QuesAnswerImg.defaultProps = { 
    question:{} 
}

QuesAnswerImg.propTypes = { 
    question: PropTypes.object.isRequired,
    clickAnswer: PropTypes.func.isRequired,
    selectedAnswer: PropTypes.object,
    clickAble: PropTypes.bool 
}

export default QuesAnswerImg;