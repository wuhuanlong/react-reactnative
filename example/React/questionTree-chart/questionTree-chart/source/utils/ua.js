const system = (() => {
    let u = navigator.userAgent
    let isWeiXin = u.match(/MicroMessenger/i) == 'micromessenger'
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 //g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
    let system = 'broswer'
    if (isAndroid) {
        system = 'Android'
    } else if (isIOS) {
        system = 'IOS'
    }
    return system
})()
 
export { system }
