import {Content} from './content';
import {html} from '../types';

export class Assessment extends Content {
    items?: Array<Question>;
    time?: number;
    // initialized at runtime
    scoreTotal?: number;
    chapterId?: number;
}

export class SimpleQuestion extends Content {
    question: Question;
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

class Response {
    label: string;
    value: string;
}
