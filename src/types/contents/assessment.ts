import {uid} from '@epoc/epoc-types/dist/v1';
import {Assessment as AssessmentType, SimpleQuestion as SimpleQuestionType} from '@epoc/epoc-types/dist/v1/content'
import {Question} from '@epoc/epoc-types/dist/v1/question';

export {Question, MultipleChoiceQuestion, SimpleChoiceQuestion, ReorderQuestion, DragAndDropquestion} from '@epoc/epoc-types/dist/v1/question';


export interface Assessment extends AssessmentType {
    id?: string;
    // initialized at runtime
    score?: number;
    scoreTotal?: number;
    chapterId?: uid;
}

export interface SimpleQuestion extends SimpleQuestionType {
    // initialized at runtime
    id?: string;
    score?: number;
    scoreTotal?: number;
    chapterId?: uid;
    questions: uid[];
}

export interface SwipeQuestion extends Question {
    correctResponse: Array<{label: string, values: string[]}>;
    possibilities?: Array<string>;
}

export interface DropDownListQuestion extends Question {
    correctResponse: Array<{label: string, values: string[]}>;
    // initialized at runtime
    categories?: Array<string>;
}
