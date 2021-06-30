import {Author} from './author';
import {Content} from './contents/content';
import {html, uid} from './types';
import {Assessment, Question} from './contents/assessment';

export class Epoc {
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Record<uid, Author>;
    summary: html;
    objectives: string[];
    certificateScore: number;
    parameters: Parameters;
    contents: Record<uid, Content>;
    chapters: Record<uid, Chapter>;
    questions: Record<uid, Question>;
    // initialized at runtime
    assessments?: Assessment[];
}

export class Chapter {
    id: uid;
    title: string;
    image?: string;
    objectives?: string[];
    contents: uid[];
    // initialized at runtime
    time?: number;
    videoCount?: number;
    assessmentCount?: number;
    initializedContents: Content[];
}

export class Parameters {
    chapterParameter?: string;
    easierScoring?: boolean;
    openQuestionButton?: string;
}
