import {Author} from './author';
import {Content} from './contents/content';
import {html, uid} from './types';
import {Assessment} from './contents/assessment';

export class Epoc {
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Author[];
    summary: html;
    objectives: string[];
    certificateScore: number;
    content: Content[];
    chapters: Chapter[];
    // initialized at runtime
    assessments?: Assessment[];
}

export class Chapter {
    name: string;
    image?: string;
    objectives?: string[];
    contentsIds: uid[];
    // initialized at runtime
    time?: number;
    videoCount?: number;
    assessmentCount?: number;
    contents?: Content[];
}
