import {Author} from './author';
import {Content} from './contents/content';
import {html, uid} from './types';
import {Assessment, Question} from './contents/assessment';

export class EpocMetadata {
    edition: string;
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Record<uid, Author>;
    summary: html;
    objectives: string[];
    chaptersCount: number;
    assessmentsCount: number;
    download: string;
}

export class EpocLibrary extends EpocMetadata {
    downloading: boolean;
    downloaded: boolean;
    unzipping: boolean;
    opened:boolean;
}

export class Epoc extends EpocMetadata {
    certificateScore: number;
    parameters: Parameters;
    contents: Record<uid, Content>;
    chapters: Record<uid, Chapter>;
    questions: Record<uid, Question>;
    // initialized at runtime
    assessments?: Assessment[];
    plugins: string[];
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
    assessments?: uid[];
    done?: boolean;
    allViewed?: boolean;
    chapterOpened?: boolean;
    assessmentDone?: boolean;
    resumeLink?:string;
}

export class Parameters {
    chapterParameter?: string;
    easierScoring?: boolean;
    openQuestionButton?: string;
}
