import {Author} from './author';
import {Content} from './contents/content';
import {html} from './types';

export class Epoc {
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Author[];
    summary: html;
    objectives: string[];
    certificateScore: number;
    parts: Array<Part>;
    content: Array<Content>;
    chapters?: CourseNode[];
    chapterCount?: number;
    assessmentCount?: number;
}

export class Part {
    title: string;
    outlineTree: CourseNode[];
    contents?: Content[];
}

export class CourseNode {
    contentId: string;
    children?: CourseNode[];
    contents?: Content[];
}
