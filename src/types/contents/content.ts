import {ChoiceCondition, Html, uid, Video, Audio} from '@epoc/epoc-types/dist/v1';
import {Assessment, SimpleQuestion} from './assessment';
import {Rule} from '@epoc/epoc-types/src/v1/rule';

export interface ContentRuntime {
    id: uid;
    viewed?: boolean;
    locked?: boolean;
    rule?: Rule;
}

// Extends base content types with runtime properties
export type Content = (Video & ContentRuntime) |
    (Audio & ContentRuntime) |
    (Html & ContentRuntime) |
    (ChoiceCondition & ContentRuntime) |
    (SimpleQuestion & ContentRuntime) |
    (Assessment & ContentRuntime);
