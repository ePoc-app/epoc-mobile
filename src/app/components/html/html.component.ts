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
import {PluginService} from 'src/app/services/plugin.service';
import renderMathInElement from 'katex/contrib/auto-render';
import mermaid from 'mermaid';
import GLightbox from 'glightbox';

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
        this.renderMath()
        await this.renderMermaid()
    }

    private async renderMermaid() {
        mermaid.initialize({ startOnLoad: false });
        const mermaidDiagram = this.content.nativeElement.querySelector('.mermaid');
        if(mermaidDiagram) {
            const { svg } = await mermaid.render('mermaid-svg', mermaidDiagram.innerHTML);
            mermaidDiagram.innerHTML = svg;
        }

    }

    private renderMath() {
        renderMathInElement(this.content.nativeElement, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
                { left: '\\(', right: '\\)', display: false },
                { left: '\\[', right: '\\]', display: true },
            ],
            throwOnError: false,
            output: 'html'
        });
    }

    handleClick(event: Event) {
        if ((event.target as HTMLElement).tagName === 'IMG') {
            const imgSrc = (event.target as HTMLImageElement).src;
            this.openLightBox(imgSrc);
        }
    }

    openLightBox(imageUrl: string) {
        const lightbox = GLightbox({
            touchNavigation: true,
            loop: false,
            zoomable: true,
            draggable: true,
            // @ts-ignore
            elements: [
                {
                    href: imageUrl,
                    type: 'image',
                    alt: 'image text alternatives'
                }
            ],
        });
        // @ts-ignore
        lightbox.open();
    }

    ngOnDestroy() {
        this.clickListener();
    }
}
