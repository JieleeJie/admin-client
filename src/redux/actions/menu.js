import { SAVE_TITLE,DELETE_TITLE} from '../constant';

export const createSaveTitleAction = (value) => {
    return { type: SAVE_TITLE, data: value }
}
export const createDeleteTitleInfoAction = () => {
    return { type: DELETE_TITLE }
}