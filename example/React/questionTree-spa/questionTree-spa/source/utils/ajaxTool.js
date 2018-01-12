const parseParams = obj => {
    if(!obj) return null
    let paramArr = []
    let postParamStr = ''
    let getParamStr = ''
    for (let attr in obj) {
        paramArr.push(attr + '=' + obj[attr]) 
    }

    getParamStr = '?' + paramArr.join('&')
    postParamStr = paramArr.join('&')

    return { getParamStr, postParamStr }
}

export default parseParams