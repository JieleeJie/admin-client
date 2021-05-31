import myAxios from './myAxios';
import jsonp from 'jsonp';
import { message } from 'antd';
import { BASE_URL, WEATHER_KEY, CITY } from '../config';

// post请求数据记得与数据库列名相对应
// 登录请求
export const reqLogin = (username, password) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/login`,
    data: { username, password }
})
// 获取天气信息
export const reqWeatherInfo = () => {
    return new Promise((resolve, reject) => {
        jsonp(`https://restapi.amap.com/v3/weather/weatherInfo?city=${CITY}&key=${WEATHER_KEY}`, (err, data) => {
            if (err) {
                message.error('获取天气信息失败', 2)
                new Promise(() => { })
            } else {
                let { city, temperature, weather } = data.lives[0]
                let weatherObj = { city, temperature, weather }
                resolve(weatherObj)
            }
        })
    })
}
// 获取商品分类列表
export const reqCategoryList = () => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/category/list`,
})
// 新增分类
export const reqAddCategory = (categoryName) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/manage/category/add`,
    data: { categoryName }
})
// 修改分类
export const reqUpdateCategory = (categoryObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/manage/category/update`,
    data: categoryObj
})
// 获取商品分页列表
export const reqProductList = (pageNum, pageSize) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/product/list`,
    params: {
        pageNum,
        pageSize
    }
})
// 商品状态处理（上架或者下架）
export const requpdateStatus = (productId, status) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/manage/product/updateStatus`,
    data: { productId, status }
})
// 根据Name/desc搜索产品分页列表
export const reqSearchProduct = (pageNum, pageSize, searchType, searchKeyword) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/product/search`,
    params: {
        pageNum,
        pageSize,
        [searchType]: searchKeyword
    }
})
// 根据商品ID获取商品
export const reqDetailProd = (detailProdId) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/product/info`,
    params: {
        productId: detailProdId
    }
})
// //请求删除图片（根据图片唯一名删除）
export const reqDeletePicture = (name) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/manage/img/delete`,
    data: { name }
})
// //请求添加商品
export const reqAddProduct = (prodObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/manage/product/add`,
    data: { ...prodObj }
})