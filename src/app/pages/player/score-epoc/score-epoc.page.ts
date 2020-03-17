import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController} from '@ionic/angular';
import {Chart} from 'chart.js';
import {Reading} from '../../../classes/reading';
import {Assessment} from '../../../classes/contents/assessment';

@Component({
    selector: 'app-score-epoc',
    templateUrl: 'score-epoc.page.html',
    styleUrls: ['score-epoc.page.scss']
})
export class ScoreEpocPage implements OnInit {

    @ViewChild('chart', {static: false}) chart;

    epoc$: Observable<Epoc>;
    reading: Reading;
    assessments: Assessment[];

    assessmentData = {
        successScore: 0,
        attemptedScore: 0,
        todoScore: 0,
        totalUserScore: 0,
        totalScore: 0
    };

    chartjs;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {
        Chart.pluginService.register({
            beforeDraw: chart => {
                if (chart.config.options.elements.center) {
                    // Get ctx from string
                    const ctx = chart.chart.ctx;

                    // Get options from the center object in options
                    const centerConfig = chart.config.options.elements.center;
                    const fontStyle = centerConfig.fontStyle || 'Arial';
                    const txt = centerConfig.text;
                    const color = centerConfig.color || '#000';
                    const sidePadding = centerConfig.sidePadding || 20;
                    const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
                    // Start with a base font of 30px
                    ctx.font = '30px ' + fontStyle;

                    // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
                    const stringWidth = ctx.measureText(txt).width;
                    const elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

                    // Find out how much the font can grow in width.
                    const widthRatio = elementWidth / stringWidth;
                    const newFontSize = Math.floor(30 * widthRatio);
                    const elementHeight = (chart.innerRadius * 2);

                    // Pick a new font size so it will not be larger than the height of label.
                    const fontSizeToUse = Math.min(newFontSize, elementHeight);

                    // Set font settings to draw it correctly.
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
                    const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
                    ctx.font = fontSizeToUse + 'px ' + fontStyle;
                    ctx.fillStyle = color;

                    // Draw text in center
                    ctx.fillText(txt, centerX, centerY);
                }
            }
        });
    }

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.route.snapshot.paramMap.get('id'));

                setTimeout(() => {
                    this.getAssessmentsData();
                    this.createBarChart();
                }, 200);
            }
        });
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.libraryService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.assessments = epoc.outline.reduce((assessments, id) => {
                const content = epoc.content.find(item => item.id === id);
                if (content && content.type === 'assessment') {
                    assessments.push(content);
                }
                return assessments;
            }, []);
        });
    }

    getAssessmentsData() {
        this.assessments.forEach((assessment) => {
            const userAssessment = this.reading.assessments.find(a => assessment.id === a.id);
            const scoreTotal = assessment.items.reduce((total, item) => total + item.score, 0);

            if (userAssessment && userAssessment.score >= scoreTotal) {
                this.assessmentData.totalUserScore += userAssessment.score;
                this.assessmentData.successScore += scoreTotal;
            } else if (userAssessment && userAssessment.score < scoreTotal) {
                this.assessmentData.totalUserScore += userAssessment.score;
                this.assessmentData.attemptedScore += scoreTotal;
            } else {
                this.assessmentData.todoScore += scoreTotal;
            }
            this.assessmentData.totalScore += scoreTotal;
        });
    }

    createBarChart() {

        this.chartjs = new Chart(this.chart.nativeElement, {
            type: 'doughnut',
            options: {
                responsive: true,
                aspectRatio: 1,
                legend: {
                    position: 'bottom'
                },
                elements: {
                    center: {
                        text: this.assessmentData.totalUserScore + '/' + this.assessmentData.totalScore,
                        sidePadding: 15
                    }
                }
            },
            data: {
                labels: ['Non fait', 'Tenté', 'Réussi'],
                datasets: [{
                    label: 'Résumé des scores',
                    data: [this.assessmentData.todoScore, this.assessmentData.attemptedScore, this.assessmentData.successScore],
                    backgroundColor: ['#989aa2', '#ffce00', '#10dc60']
                }]
            }
        });
    }
}
