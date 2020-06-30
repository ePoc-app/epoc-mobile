import {Content} from './content';

export class Assessment extends Content {
    items?: Array<Question>;
    time?: number;
    scoreTotal?: number;
}

export class SimpleQuestion extends Content {
    question: Question;
}

export class Question {
    type: string;
    score: number;
    statement: string;
    label: string;
    responses: Array<Response>;
    correctResponse: string|Array<string>|Array<{label: string, values: string[]}>;
    explanation: string;
}

export class DragAndDropquestion extends Question{
    correctResponse: Array<{label: string, values: string[]}>;
}

class Response {
    label: string;
    value: string;
}
