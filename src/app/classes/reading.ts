import {uid} from './types';

export class Reading {
    epocId: string;
    progress: number;
    assessments: UserAssessment[];
    bookmarks: number[];
    choices: UserChoice[];
    flags: uid[];
}

class UserAssessment {
    id: string;
    score: number;
    responses: string[];
}

class UserChoice {
    id: string;
    responses: string[];
}


