import {Directive, Input, ElementRef, Renderer, OnInit, HostListener} from '@angular/core';

@Directive({
  selector: '[appHideToolbar]'
})
export class HideToolbarDirective implements OnInit {
    @Input('header') header: HTMLElement;
    @Input('footer') footer: HTMLElement;

    private hidden = false;

    constructor(public element: ElementRef, public renderer: Renderer) {}

    ngOnInit() {
        this.header.style.setProperty('position', 'absolute');
        this.footer.style.setProperty('position', 'absolute');
        this.header.style.setProperty('transition', 'top 700ms');
        this.footer.style.setProperty('transition', 'bottom 700ms');
        this.element.nativeElement.style.setProperty('--padding-top', '44px');
        this.element.nativeElement.style.setProperty('--padding-bottom', '44px');
        this.showToolbar();
    }

    @HostListener('ionScroll', ['$event']) onContentScroll(event) {
        if (event.detail.deltaY >= 0) {
            this.hideToolbar();
        } else {
            this.showToolbar();
        }
    }
    @HostListener('dblclick', ['$event']) onClick(event) {
        this.toggleToolbar();
    }

    private hideToolbar() {
        this.hidden = true;
        this.header.style.setProperty('top', '-56px');
        this.footer.style.setProperty('bottom', '-56px');
    }

    private showToolbar() {
        this.hidden = false;
        this.header.style.setProperty( 'top', '0px');
        this.footer.style.setProperty('bottom', '0px');
    }

    private toggleToolbar() {
        this.hidden ? this.showToolbar() :this.hideToolbar();
    }
}
