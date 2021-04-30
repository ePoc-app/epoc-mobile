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

class Response {
    label: string;
    value: string;
}

export class SwipeQuestion extends Question {
    swipeCards: Array<SwipeCard>;
    // Ce booléen permet de vérifier si l'éditeur à choisit une explication globale ou individuelle à chaques cartes
    globalExplanation: boolean;
}

export class SwipeCard {
    id: number;
    text: string;
    explanation?: string
}
