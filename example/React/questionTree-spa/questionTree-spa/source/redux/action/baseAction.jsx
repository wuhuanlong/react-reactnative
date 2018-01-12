 
export const KWillFetchingData = '即将从服务器拉取数据'
export const KHasFetchedData = '接收到服务器数据'
export const KFetched_Recive_Error = '服务器数据接收错误'

// export const KWillFetchingData = 'Will_Fetching_Data'
// export const KHasFetchedData = 'Has_Fetched_Data'
// export const KFetched_Recive_Error = 'Fetched_Recive_Error'
// export const KGetWxConf = 'KGetWxConf'

export const Will_Fetching_Data = (path) => {
    return{
        type:KWillFetchingData,
        path
    }
}

export const Has_Fetched_Data = (path, result) => {
    return{
        type:KHasFetchedData,
        path,
        result
    }
}

export const Fetched_Recive_Error = (path, err) => {
    return{
        type:KFetched_Recive_Error,
        path,
        err
    }
}

