import {KgetData_allQuestion, KgetNextQuestion, KgetBeforeQuestion,
    KresetQuestion, KallQuestionDone, KAddReplyMessage, KAddSystemMessage, KAddResultMessage,
    KrenderStateFromHistory, KseriseReSelected, KGetWxConfSuccess} from '../action/questionTreeAction'

import {history} from '../../history/index'

const init_currentStep = {
    currentStep: 1, //当前执行到了第几步
    totalStep: 10, // 总共有几步
    currentQuestion: [], //当前题目,因为有系列题，所以设置为数组
    totalQuestion: [], //总共的题目
    questionAnswer:[],  //选择的要提交的答案
    checkResult:{}  //检查结果
}


//存放临时的所有题目，防止存入histroy中占内存
let totalQuestionTemp = [];

/**
 * 普通函数
 * 保存state到storage
 * 按需
 * @param {*} newState
 */
const saveToRouter = (newState = init_currentStep, isPush = true) => {
    let location = history.getCurrentLocation()
    let {state} = location

    totalQuestionTemp = newState.totalQuestion 

    newState.totalQuestion = []
    if(state && state.historyState){
        state.historyState.questionAnswer = newState.questionAnswer
        // 把当前路由的state替换成当前的
        location.state = {
            historyState: state.historyState
        }
        location.key=''
        history.replace(location)
    }

    // if(isPush){
    //     //push跳转到下一个路由
    //     history.push({
    //         state: {
    //             historyState: newState
    //         }
    //     })
    // }else{
        //push跳转到下一个路由
        history.replace({
            state: {
                historyState: newState
            }
        })
    // }
}


/**
 * reducer 获取所有题目
 * @param {*} state
 * @param {*} action
 */
export const QuestionTreeReducer = (state = init_currentStep, action = {}) => {
    switch (action.type) {

        case KGetWxConfSuccess:{
            action.successFunc(action.payload)
            return state
        }

        case KgetData_allQuestion: {
            const newState = Object.assign({}, state,{
                totalQuestion : [...action.totalQuestion],
                totalStep : action.totalQuestion.length,
            })

            //跳过开头已答得题目
            // newState.currentQuestion.push(action.totalQuestion[newState.currentStep-1])
            // for(const quest of action.totalQuestion){
            //     if(quest.choosedAnswer && quest.choosedAnswer.length > 0){
            //         newState.currentQuestion.push(action.totalQuestion[newState.currentStep])
            //         newState.currentStep ++
            //         continue
            //     }
            //     break
            // }

            newState.currentQuestion.push(action.totalQuestion[newState.currentStep - 1])
            saveToRouter(newState)
            return newState
        }

        case KgetNextQuestion: {
            if(!action.payload){
                return state
            }
            const {clickQuestion, choosedAnswers} = action.payload
            const {questionAnswer} = state

            if(state.currentQuestion.length <= 0 && choosedAnswers.length > 0){
                return state
            }

            // 更新已选择的答案questionAnswer
            let filter_choosedAnswer = questionAnswer.filter(function(choosedItem) {
                return choosedItem.questionID !== clickQuestion.question.id
            })
            let answersTemp = []
            choosedAnswers.map(function(answer) {
                answersTemp.push(answer.id)
            })
            filter_choosedAnswer.push({
                questionID: clickQuestion.question.id,
                choosedAnswer: answersTemp
            })
            state.questionAnswer = filter_choosedAnswer


            //若Q08选A或B，则做Q09；若Q08选C或D、E，则做Q10：
            if(clickQuestion.question.order === 8 ){
                if(choosedAnswers.length === 1){
                    const sel_answer = choosedAnswers[0]
                    if(sel_answer.order !== 1 && sel_answer.order !== 2){
                        const nextQuestions = state.totalQuestion.find(function(quest){
                            return quest.question.order === clickQuestion.question.order + 2
                        })

                        if(nextQuestions){ 
                            const nextOrder = state.totalQuestion.filter(function(quest){
                                return quest.question.order === clickQuestion.question.order+1
                            }) 
                            state.currentStep = clickQuestion.question.order + nextOrder.length + 1
                            state.currentQuestion.push(nextQuestions)

                            saveToRouter(state, isPush)
                            return state
                        }
                    }
                }
            }


            // 更新显示的currentQuestion,currentStep
            // 如果是系列题，则判断选项是不是第一选项，是则push下一个同一系列题，否则跳转下一个非同一系列题
            let isPush = true
            if(clickQuestion.question.series) {
                if(choosedAnswers[0].order !== 2){
                    //如果下一题不是系列题，或，下一题的系列号为1，则视为系列题完毕，否则 push 下一题
                    state.currentStep ++
                    let nextQuestion = state.totalQuestion[state.currentStep-1]
                    state.currentQuestion.push(nextQuestion)
                    if(!nextQuestion.question.series || (nextQuestion.question.series && nextQuestion.question.order === 1)){
                        // state.currentQuestion = [nextQuestion]
                    }else{
                        // state.currentQuestion.push(nextQuestion)
                        // 如果是系列提，并且答了多道题，则替换路由
                        isPush = false
                    }
                }else {
                    let curStepCopy = state.currentStep
                    while(state.currentStep <= state.totalStep){
                        // 判断下一题的order 和当前的order是否相同，相同则跳过，不同则设置currentQuestion，并跳出
                        curStepCopy++
                        let nextQuestion = state.totalQuestion[curStepCopy-1]
                        if(nextQuestion.question.order === clickQuestion.question.order){
                            // 更新已选择的答案questionAnswer
                            let filter_choosedAnswer = state.questionAnswer.filter(function(choosedItem) {
                                return choosedItem.questionID !== nextQuestion.question.id
                            })
                            state.questionAnswer = filter_choosedAnswer
                            continue
                        }
                        state.currentStep = curStepCopy
                        state.currentQuestion.push(state.totalQuestion[curStepCopy-1])
                        break
                    }
                }
            }else {
                // 如果是单选题或者多选题，则直接下一题
                state.currentStep ++
                state.currentQuestion.push(state.totalQuestion[state.currentStep-1])
            }

            saveToRouter(state, isPush)
            return state
        }

        case KgetBeforeQuestion: {
            history.goBack()
            return state
        }

        case KresetQuestion: {

            //清空所有已答题目
            let newState =Object.assign({}, state,{
                questionAnswer:[],
                currentStep: 1,
                currentQuestion: [state.totalQuestion[0]],
                checkResult:{}
            })

            saveToRouter(newState)
            return newState
        }

        case KallQuestionDone: {
            let newState = Object.assign({},state)
            newState.checkResult = {
                picUrl: action.picUrl
            }
            newState.currentStep = newState.totalStep + 1

            return newState
        }

        case KrenderStateFromHistory: {
            action.payload.totalQuestion = totalQuestionTemp
            const statePayload = Object.assign({},action.payload)

            return statePayload
        }

        case KseriseReSelected: {
            var firstQuestion = state.currentQuestion[0]
            state.currentStep -= (state.currentQuestion.length-1)
            state.currentQuestion = [firstQuestion]
            saveToRouter(state,false)
            return Object.assign({},state)
        }

        case KAddReplyMessage: {

            if(!action.payload){
                return state
            }
            
            const {clickQuestion, choosedAnswers} = action.payload
 
            let localReplyPrefix = clickQuestion.question.prefix 
            let localReplyText = []
            choosedAnswers.map(function(answer){
                const content = answer.content.split('|')[0]
                localReplyText.push(content)
            })

            let newObj = {
                isReply:true,
                reply:`${localReplyPrefix} ${localReplyText.join('、')}`,
                question:clickQuestion.question
            }

            state.currentQuestion.push(newObj)

            saveToRouter(state,false)
            return Object.assign({},state)
        }

        case KAddSystemMessage:{
            if(!action.payload){
                return state
            }  

            let newObj = {
                isSystem:true,
                systemMsg:action.payload.systemMsg,
                question:{
                    id: 0
                }
            }

            state.currentQuestion.push(newObj)

            saveToRouter(state,false)
            return Object.assign({},state)
        }

        case KAddResultMessage:{
            if(!action.payload){
                return state
            }  

            let newObj = {
                isResult: true,
                result: action.payload,
                question:{
                    id: 1000
                }
            }

            //移除已有的结果，重新覆盖
            let currentQuestion_filter = state.currentQuestion.filter(function (item) {
                return !item.isResult
            })
            currentQuestion_filter.push(newObj)
            state.currentQuestion = currentQuestion_filter

            saveToRouter(state, false)
            return Object.assign({},state)
        }

        default:
            return state
    }
}