import {get, post} from 'ajax'

//config 
import config from '../../client.config'
import parseParams from '../../utils/ajaxTool'


import store from '../store/index'

import { Will_Fetching_Data, Has_Fetched_Data, Fetched_Recive_Error } from './baseAction'
//storage
// import storage from '../../utils/storage'


export const KgetData_allQuestion = '从服务器获得所有题目'
export const KgetNextQuestion = '显示下一题'
export const KgetBeforeQuestion = '退回上一题'
export const KresetQuestion = '重新答题'
export const KuploadAnswer = '上传答案'
export const KallQuestionDone = '所有题目答完'

export const KrenderStateFromHistory = '从router中拿到state渲染'
export const KseriseReSelected = '回答过超过一题的同一系列题'


export const KGetWxConf = '获取微信的配置'
export const KGetWxConfSuccess = '成功获取微信的配置'

export const KAddSystemMessage = '添加系统内容'
export const KAddReplyMessage = '回复答题内容'
export const KAddResultMessage = '添加图片内容'

// export const KgetData_allQuestion = 'KgetData_allQuestion'
// export const KgetNextQuestion = 'KgetNextQuestion'
// export const KgetBeforeQuestion = 'KgetBeforeQuestion'
// export const KresetQuestion = 'KresetQuestion'
// export const KuploadAnswer = 'uploadAnswer'
// export const KallQuestionDone = 'KallQuestionDone'
// export const KrenderStateFromHistory = 'KrenderStateFromHistory'
// export const KseriseGoBack = 'KseriseGoBack'
 

//刷新时，清空所有session保存的历史state
import local from '../../utils/storage' 

/**
 * 已获得所有题目
 * @param {*} payload 
 */
const getData_allQuestion = (payload) => {
    return {
        type: KgetData_allQuestion,
        totalQuestion: payload
    }
}

/**
 * 返回上一题
 * @param {*} payload 
 */
export const beforeQuestion = (payload) => {
    return {
        type: KgetBeforeQuestion,
        payload
    }
}

/**
 * 回答下一题
 * @param {*} payload 
 */
export const getNextQuestion = (payload) => {
    return {
        type: KgetNextQuestion,
        payload
    }
}

/**
 * 重置当前已经回答的所有题目，从头开始
 * @param {*} payload 
 */
export const resetQuestion = (payload) => {
    return {
        type: KresetQuestion,
        payload
    }
}

/**
 * 所有题目答完，提交答案
 */
export const allQuestionDone = (picUrl) => {
    return {
        type: KallQuestionDone,
        picUrl
    }
}


/**
 * 返回的上一题如果是系列题，则只显示系列题的第一题，并不带选择项
 */
export const seriseReSelected = (payload) => {
    return {
        type: KseriseReSelected,
        payload
    }
}

/**
 * 从router中拿到state渲染
 * @param {*} payload 
 */
export const renderStateFromHistory = (payload) => {
    return {
        type: KrenderStateFromHistory,
        payload
    }
}

/**
 * 添加答题文本  
 * @param {*} payload 
 */
export const addReplyMessage = (payload) => {
    return {
        type: KAddReplyMessage,
        payload
    }
}

/**
 * 添加系统消息
 * @param {*} payload 
 */
export const addSystemMessage = (payload) => {
    return {
        type: KAddSystemMessage,
        payload
    }
}

export const addResultMessage = (payload) => {
    return {
        type: KAddResultMessage,
        payload
    }
}


/**
 * 请求所有题目
 * @param {*} path 
 * @param {*} payload 
 */
export const getAllQuestion = (path, payload={}) => {

    const { getParamStr } = parseParams(payload)
    let url = config.MainHost + path + getParamStr 

    return dispatch => {   
        return getAllQuestFromAjax(dispatch, url, path) 
    }
}

const getAllQuestFromAjax = function (dispatch, url, path) { 

    dispatch(Will_Fetching_Data(path))

    return get({
        url,
        success: function (data) {
            dispatch(Has_Fetched_Data(path, data))
            if (data) {
                data = JSON.parse(data)  
                if (data && data.result && data.result.errMsg === 200) { 

                    //添加系统提示的内容
                    dispatch(addSystemMessage({
                        systemMsg:'主人，我是您的理财小秘，有任何问题都可以问我哦，先来测测您的金融画像吧~'
                    }))

                    setTimeout(function() {
                        dispatch(getData_allQuestion(data.result.questionList))
                    }, 300);

                } else if(data && data.result && data.result.errMsg === 401){
                    window.location.href = config.redicatePath
                } else{
                    dispatch(Fetched_Recive_Error(path, '数据请求错误'))
                }
            } else {
                dispatch(Fetched_Recive_Error(path, '数据请求为空'))
            }
        },
        error: function (err) {
            dispatch(Fetched_Recive_Error(path, err))
        }
    })
}


/**
 * 提交答案，进入下一题
 * @param {*} path
 * @param {*} payload
 */
export const uploadPartAnswer = (path, payload) => {

    let url = config.MainHost + path
    return dispatch => {
        // ajax提交
        let choosedAnswerArr = []
        for (const answer of payload.choosedAnswers) {
            choosedAnswerArr.push(answer.id)
        }
        let answerData = {
            questionID: payload.clickQuestion.question.id,
            choosedAnswer : choosedAnswerArr
        }

        dispatch(Will_Fetching_Data(path))

        return post({
            url,
            data: answerData,
            success: function (data) {
                data = JSON.parse(data)
                if (data && data.result && data.result.errMsg === 200) {

                    //添加自己回复的内容
                    dispatch(addReplyMessage(payload))

                    //判断是否是最后一题，如果是最后一题，则提交结果，并展示金融画像
                    const {totalStep, currentStep} = store.getState().QuestionTreeReducer
                    const {clickQuestion, choosedAnswers} = payload
                    if(
                        totalStep <= currentStep ||
                        (clickQuestion.question.series && clickQuestion.question.series_order == 1 && choosedAnswers[0].order == 2) ||
                        (clickQuestion.question.series && clickQuestion.question.series_order >= 2)
                    ){

                        //添加系统提示的内容
                        setTimeout(function() {
                            dispatch(addSystemMessage({
                                systemMsg:'小秘结合易经的推演~'
                            }))
                        }, 500)

                        setTimeout(function() {
                            dispatch(addResultMessage({
                                waiting:true
                            }))
                        }, 1000)

                        let {questionAnswer} = store.getState().QuestionTreeReducer
                        questionAnswer.push(answerData)
                        dispatch(uploadAllAnswer('saveAllAnswer', questionAnswer))

                    }else{
                        setTimeout(function() {
                            dispatch(getNextQuestion(payload))
                        }, 800)
                    }
                } else if(data && data.result && data.result.errMsg === 401){
                    window.location.href = config.redicatePath
                } else{
                    dispatch(Fetched_Recive_Error(path, '数据请求错误'))
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }
}


/**
 * 上传答案
 * @param {*} path 
 * @param {*} payload 
 */
export const uploadAllAnswer = (path, answerList) => {
    let url = config.MainHost + path

    const payload = { 
        answerList: JSON.stringify(answerList)
    }
    
    return dispatch => {
        dispatch(Will_Fetching_Data(path))

        return post({
            url,
            data: payload,
            success: function (data) {
                data = JSON.parse(data)
                console.log(data)
                dispatch(Has_Fetched_Data(path, data))
                if (data && data.result && data.result.errMsg === 200){

                    setTimeout(function() {
                        dispatch(addSystemMessage({
                            systemMsg:'主人您的金融画像在古代就是......'
                        }))
                    }, 5000)

                    setTimeout(function() {
                        dispatch(addResultMessage(data.result.content))
                    }, 8000)

                } else if(data && data.result && data.result.errMsg === 401){
                    window.location.href = config.redicatePath
                } else{
                    dispatch(Fetched_Recive_Error(path, '数据请求错误'))
                }
            },
            error: function (err) {
                dispatch(Fetched_Recive_Error(path, err))
            }
        })
    }
}


export const GetWxConfSuccess = (payload, successFunc) => {
    return{
        type:KGetWxConfSuccess,
        payload,
        successFunc
    }
}

export const getWxConf = (path, payload, successFunc) =>{
    return dispatch => {
        dispatch(Will_Fetching_Data(path))

        // const {getParamStr} = parseParams(payload)
        let url = config.MainHost + path
        return get({
            url,
            data:payload,
            success: function (data) {
                dispatch(Has_Fetched_Data(path, data))
                if (data) {
                    data = JSON.parse(data)
                    dispatch(GetWxConfSuccess(data, successFunc))
                } else {
                    dispatch(Fetched_Recive_Error(path, '数据请求为空'))
                }
            },
            error: function (err) {
                dispatch(Fetched_Recive_Error(path, err))
            }
        })
    }
}