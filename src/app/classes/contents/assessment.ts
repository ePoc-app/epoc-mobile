import {Content} from './content';

export class Assessment extends Content {
    score: number;
    items: Array<Question>;
}

class Question {
    type: string;
    statement: string;
    label: string;
    responses: Array<Response>;
    correctResponse: string;
}

class Response {
    label: string;
    value: string;
}
