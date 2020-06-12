import {Content} from './content';

export class Video extends Content {
    source: string;
    summary: string;
    subtitles: {label: string, lang: string, src: string}[];
    transcript: string;
    poster: string;
}
