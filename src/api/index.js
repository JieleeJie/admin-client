import myAxios from './myAxios';
import jsonp from 'jsonp';
import { message } from 'antd';
import { BASE_URL, WEATHER_KEY, CITY } from '../config';

// post请求数据记得与数据库列名相对应
// 登录请求
export const reqLogin = (username, password) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/login`,
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
    url: `${BASE_URL}/manage/category/list`,
})
// 新增分类
export const reqAddCategory = (categoryName) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/category/add`,
    data: { categoryName }
})
// 修改分类
export const reqUpdateCategory = (categoryObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/category/update`,
    data: categoryObj
})
// 获取商品分页列表
export const reqProductList = (pageNum, pageSize) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/manage/product/list`,
    params: {
        pageNum,
        pageSize
    }
})
// 商品状态处理（上架或者下架）
export const requpdateStatus = (productId, status) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/product/updateStatus`,
    data: { productId, status }
})
// 根据Name/desc搜索产品分页列表
export const reqSearchProduct = (pageNum, pageSize, searchType, searchKeyword) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/manage/product/search`,
    params: {
        pageNum,
        pageSize,
        [searchType]: searchKeyword
    }
})
// 根据商品ID获取商品
export const reqDetailProd = (detailProdId) => myAxios({
    method: 'GET',
    url: `${BASE_URL}/manage/product/info`,
    params: {
        productId: detailProdId
    }
})
//请求删除图片（根据图片唯一名删除）
export const reqDeletePicture = (name) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/img/delete`,
    data: { name }
})
//请求添加商品
export const reqAddProduct = (prodObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/product/add`,
    data: { ...prodObj }
})
// 请求更新商品
export const reqUpdateProduct = (prodObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/product/update`,
    data: { ...prodObj }
})
// 请求新增角色
export const reqAddRole = (roleName) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/role/add`,
    data: { roleName }
})
// 获取角色列表
export const reqRoleList = () => myAxios({
    method: 'GET',
    url: `${BASE_URL}/manage/role/list`,
})
// 更新角色(给角色设置权限)
export const reqAuthRole = (roleObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/role/update`,
    data: { ...roleObj, auth_time: Date.now() }
})
// 获取所有用户列表
export const reqUserList = () => myAxios({
    method: 'GET',
    url: `${BASE_URL}/manage/user/list`,
})
// 请求新增用户
export const reqAddUser = (userObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/user/add`,
    data: { ...userObj }
})
// 更新用户
export const reqUpateUser = (userObj) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/user/update`,
    data: { ...userObj }
})
// 删除用户
export const reqDeleteUser = (userId) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/manage/user/delete`,
    data: { userId }
})