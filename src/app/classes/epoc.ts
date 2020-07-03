import {Author} from './author';
import {Content} from './contents/content';

export class Epoc {
    id: string;
    title: string;
    image: string;
    teaser?: string;
    authors: Author[];
    summary: string;
    objectives: string[];
    parts: Array<Part>;
    content: Array<Content>;
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
}
