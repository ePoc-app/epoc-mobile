import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController} from '@ionic/angular';
import {Reading} from '../../../classes/reading';
import {Assessment} from '../../../classes/contents/assessment';
import {Label} from 'ng2-charts';

@Component({
    selector: 'app-score-epoc',
    templateUrl: 'score-epoc.page.html',
    styleUrls: ['score-epoc.page.scss']
})
export class ScoreEpocPage implements OnInit {

    epoc$: Observable<Epoc>;
    reading: Reading;
    assessments: Assessment[];

    assessmentData;

    doughnutChartOptions = {
        responsive: true,
        aspectRatio: 1,
        legend: {
            position: 'bottom'
        },
        elements: {
            center: {
                text: '',
                sidePadding: 15
            }
        }
    };
    doughnutChartLabels: Label[] = [];
    doughnutChartDataset = [{
        label: 'Résumé des scores',
        data: [],
        backgroundColor: ['#989aa2', '#ffce00', '#10dc60']
    }];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        public alertController: AlertController
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.route.snapshot.paramMap.get('id'));
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

    ionViewDidEnter() {
        combineLatest(this.epoc$, this.readingStore.readings$, (epoc, reading) => ({epoc, reading})).subscribe(pair => {
            if (pair.epoc && pair.reading) {
                this.setAssessmentsData();
            }
        });
    }

    setAssessmentsData() {
        this.assessmentData = {
            successScore: 0,
            attemptedScore: 0,
            todoScore: 0,
            totalUserScore: 0,
            totalScore: 0
        };

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

        this.doughnutChartDataset = [{
            label: 'Résumé des scores',
            data: [this.assessmentData.todoScore, this.assessmentData.attemptedScore, this.assessmentData.successScore],
            backgroundColor: ['#989aa2', '#ffce00', '#10dc60']
        }];

        this.doughnutChartOptions = {
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
        };
    }
}
