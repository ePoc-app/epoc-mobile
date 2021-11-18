import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {combineLatest, Observable} from 'rxjs';
import {Epoc} from 'src/app/classes/epoc';
import {AlertController} from '@ionic/angular';
import {Reading} from 'src/app/classes/reading';
import {Assessment} from 'src/app/classes/contents/assessment';
import {jsPDF} from 'jspdf';
import {User} from 'src/app/classes/user';
import {AuthService} from 'src/app/services/auth.service';
import {Capacitor, FilesystemDirectory, Plugins} from '@capacitor/core';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {LoadingController} from '@ionic/angular';
import {EpocService} from '../../../services/epoc.service';

@Component({
    selector: 'app-epoc-score',
    templateUrl: 'score.page.html',
    styleUrls: ['score.page.scss']
})
export class EpocScorePage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    reading: Reading;
    assessments: Assessment[];

    assessmentData;

    user: User;
    loading: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        private auth: AuthService,
        private fileOpener: FileOpener,
        public alertController: AlertController,
        public loadingController: LoadingController
    ) {}

    ngOnInit() {
        this.readingStore.readings$.subscribe(readings => {
            if (readings) {
                this.reading = readings.find(item => item.epocId === this.route.snapshot.paramMap.get('id'));
            }
        });
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc())
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
            const scoreTotal = this.epocService.calcScoreTotal(this.epoc, assessment.questions);

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
        return this.epocService.calcScoreTotal(this.epoc, content.questions);
    }

    getCertificate() {
        if (!this.loading) {
            if (this.assessmentData.totalUserScore >= this.epoc.certificateScore) {
                this.presentLoading().then(() => {
                    this.downloadPdf(this.generatePdf());
                });
            } else {
                this.presentFail();
            }
        }
    }

    generatePdf(): jsPDF {
        const doc = new jsPDF({orientation: 'landscape', compress: true});
        const img = new Image();
        img.src = 'assets/img/fond-attestation.png';
        doc.addImage(img, 'PNG', 0, 0, 297, 210);
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
        return doc;
    }

    downloadPdf(doc: jsPDF) {
        const { Filesystem } = Plugins;
        const fileName = `attestation-${this.epoc.id}.pdf`;

        if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
            // Save the PDF to the device
            const output = doc.output('datauristring');
            try {
                Filesystem.writeFile({
                    path: fileName,
                    data: output,
                    directory: FilesystemDirectory.Documents
                }).then((writeFileResult) => {
                    Filesystem.getUri({
                        directory: FilesystemDirectory.Documents,
                        path: fileName
                    }).then((getUriResult) => {
                        const path = getUriResult.uri;
                        this.fileOpener.open(path, 'application/pdf')
                            .then(() => {
                                this.dismissLoading().then(() => {
                                    this.presentSuccess();
                                });
                            })
                            .catch(error => console.warn('Error openening file', error));
                    }, (error) => {
                        console.warn(error);
                    });
                });
            } catch (error) {
                console.warn('Unable to write file', error);
            }
        } else {
            doc.save(fileName);
            this.dismissLoading();
            this.presentSuccess();
        }
    }

    async presentLoading() {
        this.loading = true;
        const loading = await this.loadingController.create({
            message: 'Veuillez patienter...',
        });
        await loading.present();
    }

    async dismissLoading() {
        this.loading = false;
        this.loadingController.dismiss();
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
