import {uid} from '@epoc/epoc-types/dist/v1';

export class Reading {
    epocId: string;
    progress: number;
    chaptersProgress: {id: uid, contents: uid[]}[]
    assessments: UserAssessment[];
    bookmarks: number[];
    choices: UserChoice[];
    flags: uid[];
    certificateShown: boolean;
    statements: Statements
    badges: uid[];
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

export interface Statements {
    global: Verbs
    chapters: Record<uid, Verbs>
    pages: Record<uid, Verbs>
    contents: Record<uid, Verbs>
    questions: Record<uid, Verbs>
}

export type EntityTypes = 'global' | 'chapters' | 'pages' | 'contents' | 'questions';
export type Verb = 'played' | 'watched' | 'listened' | 'started' | 'attempted' | 'scored' | 'completed' | 'passed' | 'viewed' | 'read';

export type Verbs = {
    [key in Verb]?: string|number|boolean;
}


