import {Content} from './content';

export class Chapter extends Content {
    number: number;
    image?: string;
    objectives?: string[];
    time?: number;
    videoCount?: number;
    assessmentCount?: number;
}
