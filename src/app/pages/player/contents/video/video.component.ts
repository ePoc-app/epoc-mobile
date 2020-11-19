import {Component, Input} from '@angular/core';
import {Video} from '../../../../classes/contents/video';

@Component({
    selector: 'video-content',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
})
export class VideoComponent{
    @Input() content: Video;
}
