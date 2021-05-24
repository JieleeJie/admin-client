import myAxios from './myAxios';
import jsonp from 'jsonp';
import { message } from 'antd';
import { BASE_URL, WEATHER_KEY, CITY } from '../config';

// 登录请求
export const reqLogin = (username, password) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/login`,
    data: { username, password }
})
// 获取商品分类列表
export const reqCategoryList = () => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/category/list`,
})
// 获取天气信息
export const reqWeatherInfo = () => {
    return new Promise((resolve, reject) => {
        jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&key=${WEATHER_KEY}`, (err, data) => {
            if (err) {
                message.error('获取天气信息失败', 2)
                new Promise(()=>{})
            } else {
                let {city,temperature,weather} = data.lives[0]
                let weatherObj = {city,temperature,weather}
                resolve(weatherObj)
            }
        })
    })
}
