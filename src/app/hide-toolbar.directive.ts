import {Directive, Input, ElementRef, Renderer, OnInit, HostListener} from '@angular/core';

@Directive({
  selector: '[appHideToolbar]'
})
export class HideToolbarDirective implements OnInit {
    @Input('header') header: HTMLElement;
    @Input('footer') footer: HTMLElement;

    constructor(public element: ElementRef, public renderer: Renderer) {}

    ngOnInit() {
        this.header.style.setProperty('position', 'absolute');
        this.footer.style.setProperty('position', 'absolute');
        this.header.style.setProperty('transition', 'top 700ms');
        this.footer.style.setProperty('transition', 'bottom 700ms');
        this.element.nativeElement.style.setProperty('transition', 'padding 700ms');
        this.showToolbar();
    }

    @HostListener('ionScroll', ['$event']) onContentScroll(event) {
        if (event.detail.deltaY >= 0) {
            this.hideToolbar();
        } else {
            this.showToolbar();
        }
    }
    @HostListener('click', ['$event']) onClick(event) {
        this.showToolbar();
    }

    private hideToolbar() {
        this.header.style.setProperty('top', '-56px');
        this.footer.style.setProperty('bottom', '-56px');
        this.element.nativeElement.style.setProperty('--padding-top', '0');
        this.element.nativeElement.style.setProperty('--padding-bottom', '0');
    }

    private showToolbar() {
        this.header.style.setProperty( 'top', '0px');
        this.footer.style.setProperty('bottom', '0px');
        this.element.nativeElement.style.setProperty('--padding-top', '44px');
        this.element.nativeElement.style.setProperty('--padding-bottom', '44px');
    }
}
