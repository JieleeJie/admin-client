import { SAVE_CATEGORY_LIST } from '../constant';

export const createSaveCategoryListAction = (value) => {
    return { type: SAVE_CATEGORY_LIST, data: value }
}