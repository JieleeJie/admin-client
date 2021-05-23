import myAxios from './myAxios';
import {BASE_URL} from '../config';

export const reqLogin = (username, password) => myAxios({
    method: 'POST',
    url: `${BASE_URL}/api1/login`,
    data: {username, password}
})
export const reqCategoryList = () => myAxios({
    method: 'GET',
    url: `${BASE_URL}/api1/manage/category/list`,
})