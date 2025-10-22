import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
    QueryList,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {DragAndDropquestion} from 'src/app/classes/contents/assessment';
import {AbstractQuestionComponent} from '../abstract-question.component';
import {GestureController} from '@ionic/angular';

@Component({
    selector: 'drag-and-drop',
    templateUrl: '../drag-and-drop/drag-and-drop.component.html',
    styleUrls: ['../drag-and-drop/drag-and-drop.component.scss']
})
export class DragAndDropComponent extends AbstractQuestionComponent implements OnInit, AfterViewInit {

    @Input() question: DragAndDropquestion;
    @ViewChildren('dropZonesElems') dropZonesElems:QueryList<ElementRef>;
    @ViewChild('dropItem') dropItem: ElementRef;

    @Output() dragging = new EventEmitter<string>();

    current;
    responses = [];
    answer;
    dropZones: {label:string, isOpen:boolean}[];
    isDragging = false;
    interval:number;

    constructor(
        private ref: ChangeDetectorRef,
        private gestureCtrl: GestureController
    ) {
        super();
    }

    ngOnInit(): void {
        this.dropZones = this.question.correctResponse.map((zone) => {
            return {label: zone.label, isOpen: false};
        });

        if (this.userPreviousResponse) {
            this.answer = this.userPreviousResponse;
        } else {
            this.answer = this.question.correctResponse.map((zone) => {
                return [];
            });
        }
        if (!this.disabled) {
            const shuffleArray = arr => arr
                .map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1]);

            this.responses = shuffleArray(this.question.responses);
        }
    }

    ngAfterViewInit() {
        if (!this.dropItem) return;
        const elem = this.dropItem.nativeElement.parentElement;
        const drag = this.gestureCtrl.create({
            el: elem,
            threshold: 0,
            gestureName: 'drag',
            onStart: ev => {
                this.isDragging = true;
                this.dragging.emit('dragstart');
                this.ref.detectChanges();
            },
            onMove: ev => {
                // Calculate the current position of the draggable element
                const scrollArea = elem.closest('app-card');

                const currentY = this.getRelativeYPosition(elem, scrollArea);

                clearInterval(this.interval);

                // Check if the draggable element is near the edge of the screen
                let scrollTo = scrollArea.scrollTop;
                if (currentY < 0) {
                    scrollTo -= 10;
                    scrollArea.scrollTo({top: scrollTo});
                    this.interval = setInterval(() => {
                        scrollTo -= 10;
                        scrollArea.scrollTo({top: scrollTo});
                        elem.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY + scrollArea.scrollTop}px)`;
                    }, 50);
                } else if (currentY > (scrollArea.offsetHeight - elem.offsetHeight)) {
                    scrollTo += 10;
                    scrollArea.scrollTo({top: scrollTo});
                    this.interval = setInterval(() => {
                        scrollTo += 10;
                        scrollArea.scrollTo({top: scrollTo});
                        elem.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY + scrollArea.scrollTop}px)`;
                    }, 50);
                }

                // Move the draggable element
                elem.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY + scrollArea.scrollTop}px)`;
                elem.style.zIndex = 10;

                const zoneIndex = this.hoveringZone(ev.currentX, ev.currentY);
                if (zoneIndex !== -1) {
                    this.dropZonesElems.toArray()[zoneIndex].nativeElement.style.borderColor = 'var(--ion-color-inria-spe)';
                }
                this.ref.detectChanges();
            },
            onEnd: ev => {
                elem.style.transform = `translate(0,0)`;
                this.isDragging = false;
                clearInterval(this.interval);
                this.dragging.emit('dragend');
                const zoneIndex = this.hoveringZone(ev.currentX, ev.currentY);
                if (zoneIndex !== -1) {
                    this.dropZonesElems.toArray()[zoneIndex].nativeElement.style.borderColor = '';
                    this.addResponse(zoneIndex);
                }
                this.ref.detectChanges();
            },
        });

        drag.enable();
    }

    hoveringZone (x, y) : number {
        let hoveringZoneIndex = -1;
        this.dropZonesElems.forEach((zone, index) => {
            const rect = zone.nativeElement.getBoundingClientRect();
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                zone.nativeElement.style.borderColor = '';
                return;
            }
            hoveringZoneIndex = index;
        })
        return hoveringZoneIndex;
    }

    addResponse(index) {
        if (this.responses.length > 0) {
            this.answer[index].push(this.responses.shift());
            if (this.responses.length === 0) {
                this.userResponse.emit(this.answer);
            }
        }
    }

    removeResponse($event, zoneIndex, responseIndex) {
        $event.stopPropagation();
        const response = this.answer[zoneIndex].splice(responseIndex, 1);
        this.responses.unshift(...response);
        this.ref.detectChanges();
    }

    openZone($event, zone) {
        $event.stopPropagation();
        zone.isOpen = !zone.isOpen;
    }

    getRelativeYPosition(node1, node2) {
        const rect1 = node1.getBoundingClientRect();
        const rect2 = node2.getBoundingClientRect();
        return rect1.top - rect2.top;
    }
}
