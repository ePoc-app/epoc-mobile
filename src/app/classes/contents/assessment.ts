import {Content} from './content';

export class Assessment extends Content {
    items: Array<Question>;
}

class Question {
    type: string;
    score: number;
    statement: string;
    label: string;
    responses: Array<Response>;
    correctResponse: string;
}

class Response {
    label: string;
    value: string;
}
