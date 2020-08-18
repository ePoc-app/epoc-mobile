import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from '../../../services/reading-store.service';
import {LibraryService} from '../../../services/library.service';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from '../../../classes/epoc';
import {AlertController} from '@ionic/angular';
import {Reading} from '../../../classes/reading';
import {Assessment, SimpleQuestion} from '../../../classes/contents/assessment';
import {Label} from 'ng2-charts';
import {jsPDF} from 'jspdf';

@Component({
    selector: 'app-score-epoc',
    templateUrl: 'score-epoc.page.html',
    styleUrls: ['score-epoc.page.scss']
})
export class ScoreEpocPage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
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
            this.epoc = epoc;
            this.assessments = epoc.assessments;
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
            totalUserScoreInPercent: 0,
            totalScore: 0
        };

        this.assessments.forEach((assessment) => {
            const userAssessment = this.reading.assessments.find(a => assessment.id === a.id);
            const scoreTotal = assessment.items.reduce((total, item) => total + item.score, 0);

            if (userAssessment && userAssessment.score > 0) {
                this.assessmentData.totalUserScore += userAssessment.score;
                this.assessmentData.successScore += userAssessment.score;

                if (userAssessment.score < scoreTotal) {
                    this.assessmentData.attemptedScore += scoreTotal - userAssessment.score;
                }
            } else {
                this.assessmentData.todoScore += scoreTotal;
            }
            this.assessmentData.totalScore += scoreTotal;
        });

        this.assessmentData.totalUserScoreInPercent = Math.round(this.assessmentData.totalUserScore / this.assessmentData.totalScore * 100);

        this.doughnutChartDataset = [{
            label: 'Résumé des scores',
            data: [this.assessmentData.todoScore, this.assessmentData.successScore, this.assessmentData.attemptedScore],
            backgroundColor: ['#989aa2', '#10dc60', '#ffce00']
        }];

        this.doughnutChartOptions = {
            responsive: true,
            aspectRatio: 1,
            legend: {
                position: 'bottom'
            },
            elements: {
                center: {
                    text: this.assessmentData.totalUserScoreInPercent + '%',
                    sidePadding: 15
                }
            }
        };
    }

    getScore(content) {
        if (this.reading) {
            const userAssessment = this.reading.assessments.find(assessment => assessment.id === content.id);
            if (userAssessment) {
                return userAssessment.score;
            }
        }

        return null;
    }

    getScoreTotal(content) {
        return content.items.reduce((total, item) => item.score + total, 0);
    }

    getCertificate() {
        if (this.assessmentData.totalUserScoreInPercent >= this.epoc.certificateScore) {
            const doc = new jsPDF();

            doc.text('Attestation de réussite de l\'ePoc ' + this.epoc.title, 10, 10);
            doc.save('a4.pdf');
            this.presentSuccess();
        } else {
            this.presentFail();
        }
    }

    async presentFail() {
        const alert = await this.alertController.create({
            header: 'Non disponible',
            message: 'Vous n\'avez pas encore atteint le score nécessaire (' + this.epoc.certificateScore + '%) pour obtenir l\'attestation.',
            buttons: ['OK']
        });

        await alert.present();
    }

    async presentSuccess() {
        const alert = await this.alertController.create({
            header: 'Téléchargement terminé',
            message: 'Vous avez bien obtenu l\'attestation.',
            buttons: ['OK']
        });

        await alert.present();
    }
}
