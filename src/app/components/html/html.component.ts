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
import {PluginService} from 'src/app/services/plugin.service';
import mermaid from 'mermaid';

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
    pluggedHtml: string;
    clickListener: () => void;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        private route: ActivatedRoute,
        private pluginService: PluginService
    ) {}

    async ngOnInit() {
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
        this.pluggedHtml = this.html;
        this.pluggedHtml = await this.pluginService.embed(this.html);
    }

    // tslint:disable-next-line:use-lifecycle-interface
    async ngAfterViewInit() {
        mermaid.initialize({ startOnLoad: false });
        const mermaidDiagram = this.content.nativeElement.querySelector('.mermaid');
        if(mermaidDiagram) {
            const { svg } = await mermaid.render('mermaid-svg', mermaidDiagram.innerHTML);
            mermaidDiagram.innerHTML = svg;
        }
    }

    ngOnDestroy() {
        this.clickListener();
    }

}
