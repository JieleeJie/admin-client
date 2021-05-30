import {SAVE_PROD_LIST} from '../constant';

export const createSaveProductListAction = (value) => {
    return {type:SAVE_PROD_LIST,data:value}
}