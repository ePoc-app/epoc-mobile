import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EpocService} from '../../services/epoc.service';

@Component({
    selector: 'html-content',
    templateUrl: './html.component.html',
    styleUrls: ['./html.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HtmlComponent implements OnInit, OnDestroy {
    @Input() html: string;
    @Output() goTo = new EventEmitter<string>();
    @ViewChild('content', {static: true}) content: ElementRef;

    epocId: string;
    chapterId: string;
    clickListener: () => void;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.epocId = this.route.snapshot.paramMap.get('id');
        this.chapterId = this.route.snapshot.paramMap.get('chapter');
        this.clickListener = this.renderer.listen(this.content.nativeElement, 'click', ({target}) => {
            if (target && target.nodeName === 'A' && target.hasAttribute('linkto')) {
                const [chapterId, content, contentId] = target.getAttribute('linkto').split('/')
                if (this.chapterId === chapterId && contentId) {
                    this.goTo.emit(contentId)
                } else {
                    this.router.navigateByUrl(`/epoc/play/${this.epocId}/${target.getAttribute('linkto')}`);
                }
            }
        });
    }

    ngOnDestroy() {
        this.clickListener();
    }

}
