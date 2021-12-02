import {uid} from './types';

export class Reading {
    epocId: string;
    progress: number;
    chaptersProgress: {id: uid, contents: uid[]}[]
    assessments: UserAssessment[];
    bookmarks: number[];
    choices: UserChoice[];
    flags: uid[];
    certificateShown: boolean;
}

export class UserAssessment {
    id: string;
    score: number;
    responses: string[];
}

class UserChoice {
    id: string;
    responses: string[];
}


