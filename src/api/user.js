import request from '../utils/request'
import config from '../config/index'
import { ApiMethodContants } from './base'
import { getRefreshToken } from '../utils/cache'
import CryptoJS from 'crypto-js';


/** 登录 */
export function login(loginData) {

    let name = "767ec6342382e4f6e61eb6b309a77ee7"
    let pass = '12aa3ab7fb72372ae063bf8dd24cc3d7'

    let lname = CryptoJS.MD5(loginData.account).toString();
    let lpass = CryptoJS.MD5(loginData.password).toString();

    if (lname == name && lpass == pass) {
        return Promise.resolve().then(() => {
            return {
                code: 200,
                data: {
                    token: "12aa3ab7fb72372ae063bf8dd24cc3d7",
                    time: new Date()
                }
            }
        })
    } else {
        return Promise.resolve().then(() => {
            return {
                code: 403,
                data: {
                    token: "",
                    time: new Date()
                }
            }
        })
    }



    // return request < ResultData < LoginResult >> ({
    //     url: `${config.api.baseUrl}/login`,
    //     method: ApiMethodContants.POST,
    //     data: loginData
    // })
}


export function updateToken() {
    return request({
        url: `${config.api.baseUrl}/update/token`,
        method: ApiMethodContants.POST,
        headers: { Authorization: 'Bearer ' + getRefreshToken() }
    })
}


export function resetPassword(userId) {
    return request < ResultData < null >> ({
        url: `${config.api.baseUrl}/user/password/reset/${userId}`,
        method: ApiMethodContants.PUT
    })
}