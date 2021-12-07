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
    responses;
    answer;
    dropZones: {label:string, isOpen:boolean}[];
    isDragging = false;

    // Used in html to display values
    selectValue = [];
    selectClass: any;

    constructor(
        private ref: ChangeDetectorRef,
        private gestureCtrl: GestureController
    ) {
        super();
    }

    ngOnInit(): void {
        const shuffleArray = arr => arr
            .map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1]);

        this.responses = shuffleArray(this.question.responses);

        this.dropZones = this.question.correctResponse.map((zone) => {
            return {label: zone.label, isOpen: false};
        });

        this.answer = this.question.correctResponse.map((zone) => {
            return [];
        });
        this.selectClass = this.question.correctResponse.map((zone) => {
            return [];
        });
    }

    ngAfterViewInit() {
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
                elem.style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`;
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
}
