import {uid} from '@epoc/epoc-types/dist/v1';
import {Epoc as EpocType, EpocMetadata} from '@epoc/epoc-types/dist/v1';
import {Rule} from '@epoc/epoc-types/dist/v2/rule';
import {Chapter as ChapterType} from '@epoc/epoc-types/dist/v1/epoc/';
import {Content} from './contents/content'
import {Assessment, Question, SimpleQuestion} from './contents/assessment';
import {ePocCollection} from '@epoc/epoc-types/dist/v1/collection';

export {EpocMetadata} from '@epoc/epoc-types/dist/v1'

export interface CustomLibrary {
    name: string;
    url: string;
    epocs: EpocLibrary[]
}

export interface Epoc extends EpocType {
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
