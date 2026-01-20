import type {Epoc as EpocType, Chapter as ChapterType, EpocMetadata, uid} from '@epoc/epoc-types/dist/v1';
import type {Rule} from '@epoc/epoc-types/dist/v2/rule';
import type {Content} from './contents/content'
import type {Assessment, Question, SimpleQuestion} from './contents/assessment';
import type {ePocCollection} from '@epoc/epoc-types/dist/v1/collection';

export type {EpocMetadata} from '@epoc/epoc-types/dist/v1'

export interface CustomLibrary {
    name: string;
    url: string;
    epocs: EpocLibrary[]
}

export interface Epoc extends EpocType {
    dir: string;
    assessments: (Assessment|SimpleQuestion)[]
    chapters:  Record<uid, Chapter>;
    contents: Record<uid, Content>;
    questions: Record<uid, Question>;
    badges: Record<uid, Badge>;
    certificateBadgeCount: number;
}

export interface EpocLibraryState {
    downloading?: boolean,
    unzipping?: boolean,
    downloaded?: boolean,
    opened?: boolean,
    updateAvailable?: boolean
}


export interface EpocLibrary extends EpocMetadata {
    downloading: boolean;
    downloaded: boolean;
    unzipping: boolean;
    opened: boolean;
    dir: string;
    updateAvailable: boolean;
    lastModified: string;
    lang: string;
    translation: '';
}
export interface EpocCollection extends ePocCollection{
    ePocs: Record<uid, EpocLibrary>;
}

export interface Chapter extends ChapterType {
    type: 'chapter'
    id?: uid;
    time?: number;
    mediaCount?: number;
    assessmentCount?: number;
    initializedContents: Content[];
    assessments?: uid[];
    done?: boolean;
    allViewed?: boolean;
    chapterOpened?: boolean;
    assessmentDone?: boolean;
    resumeLink?:string;
}


export interface Badge {
    id?: uid;
    title: string;
    description: string;
    icon: string;
    rule: Rule
}
