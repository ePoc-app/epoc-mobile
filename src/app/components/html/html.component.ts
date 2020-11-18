import {Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'html-content',
    templateUrl: './html.component.html',
    styleUrls: ['./html.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HtmlComponent implements OnInit, OnDestroy {
    @Input() html: string;
    @ViewChild('content', {static: true}) content: ElementRef;

    epocId: string;
    clickListener: () => void;

    constructor(private renderer: Renderer2, private router: Router, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.epocId = this.route.snapshot.paramMap.get('epocId');
        this.clickListener = this.renderer.listen(this.content.nativeElement, 'click', ({target}) => {
            if (target && target.nodeName === 'A' && target.hasAttribute('linkto')) {
                this.router.navigateByUrl(`/player/play/${this.epocId}/${target.getAttribute('linkto')}`);
            }
        });
    }

    ngOnDestroy() {
        this.clickListener();
    }

}
