import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @ViewChild('card') card: ElementRef;
  pinching = false;
  zoomedIn = false;
  initScale = 1;
  scale = 1;

  panning = false;
  offsetX = 0;
  offsetY = 0;
  panStartX = 0;
  panStartY = 0;
  constructor() { }

  ngOnInit() {}

  zoomStart() {
    this.initScale = this.scale;
    this.zoomedIn = true;
    this.pinching = true;
    this.card.nativeElement.closest('swiper-container').swiper.allowTouchMove = false;
  }

  zoomInOut(event) {
    event.srcEvent.preventDefault();
    event.srcEvent.stopPropagation();
    this.scale = this.initScale * event.scale;
  }

  zoomEnd() {
    this.pinching = false;
    if (this.scale < 1.1) {
      this.resetZoom();
    }
  }

  panStart() {
    if (!this.zoomedIn) return;
    this.panning = true;
    this.panStartX = this.offsetX;
    this.panStartY = this.offsetY;
  }

  panMove(event) {
    if (!this.zoomedIn || !this.panning) return;
    this.offsetX = this.panStartX + (event.deltaX/this.scale);
    this.offsetY = this.panStartY +  (event.deltaY/this.scale);

    if (this.offsetX > window.innerWidth/2) this.offsetX = window.innerWidth/2;
    if (this.offsetX < -window.innerWidth/2) this.offsetX = -window.innerWidth/2;

    if (this.offsetY > window.innerHeight/2) this.offsetY = window.innerHeight/2;
    if (this.offsetY < -window.innerHeight/2) this.offsetY = -window.innerHeight/2;
  }

  panEnd() {
    this.panning = false;
  }

  tap(event) {
    if (event.tapCount >= 2) {
      this.resetZoom();
    }
  }

  resetZoom() {
      this.scale = 1;
      this.offsetX = 0;
      this.offsetY = 0;
      const s = this.card.nativeElement.closest('swiper-container:not(.assessment-swiper)');
      if (s) s.swiper.allowTouchMove = true;
      this.zoomedIn = false;
  }
}
