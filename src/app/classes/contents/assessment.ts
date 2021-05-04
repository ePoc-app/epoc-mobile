import {Content} from './content';
import {html, uid} from '../types';

export class Assessment extends Content {
    questions?: uid[];
    time?: number;
    // initialized at runtime
    scoreTotal?: number;
    chapterId?: uid;
}

export class SimpleQuestion extends Content {
    question: uid;
    // initialized at runtime
    chapterId?: number;
}

export class Question {
    type: string;
    score: number;
    statement: string;
    label: string;
    responses: Array<Response>;
    correctResponse: string|Array<string>|Array<{label: string, values: string[]}>;
    explanation: html;
}

export class DragAndDropquestion extends Question{
    correctResponse: Array<{label: string, values: string[]}>;
}

export class Response {
    label: string;
    value: string;
    explanation?: string;
}

export class SwipeQuestion extends Question {
    swipeCards: Array<Response>;
    possibilities: Array<string>;
}
