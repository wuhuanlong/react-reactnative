import encrypt from './encrypt' 

const {encode, decode} = encrypt

const {localStorage, sessionStorage} = window 

const session = {
    save: (key, val) => {
        if(key && key.length<=0){
            return false
        }

        let value
        if(val instanceof Object) {
            value = JSON.stringify(val)
        }else {
            value += ''
        }

        sessionStorage.setItem(encode(key), encode(value)) 
        return true
    },

    get: (key) => {
        if(key && key.length<=0){
            return ''
        }

        let value = sessionStorage.getItem(encode(key))
        value = value ? decode(value) : ''

        try {
            value = JSON.parse(value)
        } catch (error) {
            console.log(error)
        }

        return value
    },

    del: (key) => {
        if(key && key.length<=0){
            return false
        }

        sessionStorage.removeItem(encode(key)) 
        return true
    },

    delAll: () => {
        sessionStorage.clear()
        return true
    }
} 

const local = {
    save: (key, val) => {
        if(key && key.length<=0){
            return false
        }

        let value
        if(val instanceof Object) {
            value = JSON.stringify(val)
        }else {
            value += ''
        }

        localStorage.setItem(encode(key), encode(value)) 
        return true
    },

    get: (key) => {
        if(key && key.length<=0){
            return ''
        }

        let value = localStorage.getItem(encode(key))
        value = value ? decode(value) : ''

        try {
            value = JSON.parse(value)
        } catch (error) {
            console.log(error)
        }

        return value
    },

    del: (key) => {
        if(key && key.length<=0){
            return false
        }

        localStorage.removeItem(encode(key)) 
        return true
    },

    delAll: () => {
        localStorage.clear()
        return true
    }
}

export default {session, local}