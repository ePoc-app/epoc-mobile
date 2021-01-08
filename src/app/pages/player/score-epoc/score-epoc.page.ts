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
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {jsPDF} from 'jspdf';
import {User} from '../../../classes/user';
import {AuthService} from '../../../services/auth.service';

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

    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public libraryService: LibraryService,
        private readingStore: ReadingStoreService,
        private iab: InAppBrowser,
        private auth: AuthService,
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
                this.libraryService.getEpoc())
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.assessments = epoc.assessments;
        });

        this.auth.getUser().subscribe(user => {
            this.user = user;
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
            const scoreTotal = this.libraryService.calcScoreTotal(this.epoc, assessment.questions);

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
        return this.libraryService.calcScoreTotal(this.epoc, content.questions);
    }

    getCertificate() {
        if (true || this.assessmentData.totalUserScore >= this.epoc.certificateScore) {
            const doc = new jsPDF({orientation: 'landscape'});
            const img = new Image();
            console.log('test');
            img.src = 'assets/img/fond-attestation.png';
            doc.addImage(img, 'png', 0, 0, 297, 210);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor('#ffffff');
            doc.text('Ce document atteste de la participation et de la réussite au cours :', 25, 90);
            doc.setFontSize(15);
            doc.setFont('Helvetica', 'bold');
            doc.text(this.epoc.title, 25, 100);
            doc.setFontSize(12);
            doc.setFont('Helvetica', 'normal');
            if (this.user) {
                doc.text('Pour le participant :', 25, 120);
                doc.setFontSize(18);
                doc.setFont('Helvetica', 'bold');
                doc.text(this.user.firstname + ' ' + this.user.lastname, 25, 130);
            }
            const url = doc.output('dataurlstring', {filename: 'attestation.pdf'});
            this.iab.create(url, '_blank', {hideurlbar: 'yes', hidenavigationbuttons: 'yes', location: 'no', closebuttoncaption: 'X Fermer'});
            this.presentSuccess();
        } else {
            this.presentFail();
        }
    }

    async presentFail() {
        const alert = await this.alertController.create({
            header: 'Non disponible',
            message: 'Vous n\'avez pas encore atteint le score nécessaire (' + this.epoc.certificateScore + ' pts) pour obtenir l\'attestation.',
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
