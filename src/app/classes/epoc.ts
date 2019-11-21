import {Author} from './author';

export class Epoc {
    id: string;
    title: string;
    image: string;
    authors: Author[];
    summary: string;
    content: Array<object>;
}
