import { SAVE_TITLE} from '../constant';

export const createSaveTitleAction = (value) => {
    return { type: SAVE_TITLE, data: value }
}