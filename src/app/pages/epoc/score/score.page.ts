import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {ReadingStoreService} from 'src/app/services/reading-store.service';
import {combineLatest, Observable} from 'rxjs';
import {Badge, Epoc} from 'src/app/classes/epoc';
import {AlertController} from '@ionic/angular';
import {Reading} from 'src/app/classes/reading';
import {Assessment, SimpleQuestion} from 'src/app/classes/contents/assessment';
import {jsPDF} from 'jspdf';
import {User} from 'src/app/classes/user';
import {AuthService} from 'src/app/services/auth.service';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory} from '@capacitor/filesystem';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {LoadingController} from '@ionic/angular';
import {EpocService} from 'src/app/services/epoc.service';
import {MatomoTracker} from '@ngx-matomo/tracker';
import {SettingsStoreService} from 'src/app/services/settings-store.service';
import {Settings} from 'src/app/classes/settings';
import {TranslateService} from '@ngx-translate/core';
import {uid} from '@epoc/epoc-types/dist/v1';

@Component({
    selector: 'app-epoc-score',
    templateUrl: 'score.page.html',
    styleUrls: ['score.page.scss']
})
export class EpocScorePage implements OnInit {

    epoc$: Observable<Epoc>;
    epoc: Epoc;
    reading: Reading;
    assessments: (Assessment|SimpleQuestion)[];

    assessmentData;

    user: User;
    loading: boolean;
    certificateEnabled = false;

    settings: Settings;

    badgeMode = false;
    unlockedBadges: uid[] = [];
    badgeModal: Badge = null;
    showBadgeModal = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public epocService: EpocService,
        private readingStore: ReadingStoreService,
        private auth: AuthService,
        private fileOpener: FileOpener,
        public alertController: AlertController,
        public loadingController: LoadingController,
        private readonly tracker: MatomoTracker,
        private settingsStore: SettingsStoreService,
        public translate: TranslateService
    ) {}

    ngOnInit() {
        this.epoc$ = this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.epocService.getEpoc(params.get('id')))
        );

        this.epoc$.subscribe(epoc => {
            this.epoc = epoc;
            this.assessments = epoc.assessments;
            if (Object.keys(this.epoc.badges).length > 0) {
                this.badgeMode = true;
            }
        });

        this.auth.getUser().subscribe(user => {
            this.user = user;
        });

        this.settingsStore.settings$.subscribe(settings => {
            if (settings) {
                this.settings = settings;
            }
        });
    }

    ionViewDidEnter() {
        combineLatest([this.epoc$, this.readingStore.readings$]).subscribe(([epoc, readings]) => {
            if (epoc && readings) {
                this.reading = readings.find(item => item.epocId === this.route.snapshot.paramMap.get('id'));
                if (!this.reading) this.readingStore.addReading(this.epoc.id);
                if (this.badgeMode) {
                    this.unlockedBadges = this.reading.badges;
                    this.certificateEnabled = epoc.certificateBadgeCount <= this.unlockedBadges.length
                } else {
                    this.setAssessmentsData();
                }
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
            const userAssessment = this.reading?.assessments.find(a => assessment.id === a.id);
            const scoreTotal = this.epocService.calcScoreTotal(this.epoc, assessment.questions);

            assessment.score = this.getScore(assessment);
            assessment.scoreTotal = this.getScoreTotal(assessment);

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

        this.certificateEnabled = this.assessmentData.totalUserScore >= this.epoc.certificateScore;
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

    async getCertificate() {
        if (!this.loading) {
            if (this.settings.devMode || this.assessmentData.totalUserScore >= this.epoc.certificateScore) {
                if (!this.user) {
                    this.setUser().then();
                } else {
                    this.presentLoading().then(() => {
                        this.downloadPdf(this.generatePdf());
                    });
                }
            } else {
                this.presentFail(
                    this.translate.instant('PLAYER.SCORE.FAIL_MODAL.HEADER'),
                    this.translate.instant('PLAYER.SCORE.FAIL_MODAL.MSG', {score: this.epoc.certificateScore})
                );
            }
        }
    }

    async setUser(){
        const alert = await this.alertController.create({
            header: this.translate.instant('SETTINGS_PAGE.SET_USER.INFO'),
            message: this.translate.instant('SETTINGS_PAGE.SET_USER.MESSAGE'),
            inputs: [
                {
                    name: 'lastname',
                    type: 'text',
                    placeholder: this.translate.instant('SETTINGS_PAGE.SET_USER.LASTNAME_PLACEHOLDER'),
                },
                {
                    name: 'firstname',
                    type: 'text',
                    placeholder: this.translate.instant('SETTINGS_PAGE.SET_USER.FIRSTNAME_PLACEHOLDER'),
                }
            ],
            buttons: [
                {
                    text: this.translate.instant('CANCEL'),
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: this.translate.instant('CONFIRM'),
                    handler: (data) => {
                        this.user = {firstname:data.firstname, lastname: data.lastname , username: null, email: null};
                        this.auth.setUser(this.user);
                        this.presentLoading().then(() => {
                            this.downloadPdf(this.generatePdf());
                        });
                    }
                }
            ]
        });

        await alert.present();
    }

    generatePdf(): jsPDF {
        const colors = {
            darkblue: '#384257',
            blue: '#6477A0',
            orange: '#FFA029',
            lightblue: '#edf3f8'
        };
        const password = Math.random().toString(36).substring(2,12);
        const doc = new jsPDF({
            orientation: 'portrait',
            compress: true,
            encryption: {
                userPermissions: ['print'],
                ownerPassword: password
            }
        });
        const img = new Image();
        const centeredText = (text, y) => {
            const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
            const textOffset = (doc.internal.pageSize.width - textWidth) / 2;
            doc.text(text, textOffset, y);
        };

        img.src = 'assets/img/fond-attestation.png';
        doc.addImage(img, 'PNG', 0, 0, 210, 297);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(15);
        doc.setTextColor(colors.orange);
        centeredText(this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.COMPLETION_CERTIFICATE'), 90);
        doc.setFontSize(18);
        doc.setTextColor(colors.darkblue);
        centeredText(this.epoc.title, 110);
        doc.setFillColor(colors.orange);
        doc.roundedRect(90, 120, 30, 1, 1, 1, 'F');
        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        centeredText(this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.AUTHORS'), 130);
        doc.setFontSize(10);
        doc.setTextColor(colors.blue);
        let posY = 140;
        const margin = 2;
        const date = new Date();
        Object.values(this.epoc.authors).forEach((author, index, array) => {
            if (index % 2 === 0) {
                if (index === array.length - 1) {
                    centeredText(author.name, posY);
                    posY += 6;
                } else {
                    const textWidth = doc.getStringUnitWidth(author.name) * doc.getFontSize() / doc.internal.scaleFactor;
                    doc.text(author.name, 104 - margin - textWidth, posY);
                }
            } else {
                doc.text(author.name, 104 + margin, posY);
                posY += 6;
            }
        });
        doc.setTextColor(colors.darkblue);
        centeredText(`${this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.EPOC_EDITION')} : ${this.epoc.edition ? this.epoc.edition : date.getFullYear()}`, posY);
        posY += 6;
        doc.setFillColor(colors.lightblue);
        doc.roundedRect(50, posY, 110, 1, 1, 1, 'F');
        posY += 10;
        doc.setFontSize(12);
        centeredText(this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.DELIVERED_TO'), posY);
        posY += 10;
        doc.setFontSize(18);
        doc.setFont('Helvetica', 'bold');
        centeredText(this.user.firstname + ' ' + this.user.lastname, posY);
        posY += 7;
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'normal');
        centeredText(`${this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.DELIVERED_THE')} ${this.translate.currentLang === 'fr' ? date.toLocaleDateString('fr') : date.toLocaleDateString('en-US')}`, posY);
        const id = Math.floor(Math.random() * 10000000);
        posY += 7;
        doc.setFontSize(8);
        doc.setFont('Helvetica', 'normal');
        centeredText(`N°${id}`, posY);

        this.tracker.trackEvent('Certificate', 'Generate certificate', `Certificate ${this.epoc.id} n°${id} (${password})`);
        return doc;
    }

    downloadPdf(doc: jsPDF) {
        const fileName = `attestation-${this.epoc.id}.pdf`;

        if (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android') {
            // Save the PDF to the device
            const output = doc.output('datauristring');
            Filesystem.writeFile({
                path: fileName,
                data: output,
                directory: Directory.Data
            }).then(() => {
                Filesystem.getUri({
                    directory: Directory.Data,
                    path: fileName
                }).then((getUriResult) => {
                    const path = getUriResult.uri;
                    this.fileOpener.open(path, 'application/pdf').then(() => {
                        this.dismissLoading();
                    }).catch(() => {
                        this.dismissLoading().then(() => {
                            this.presentFail(
                                this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR'),
                                this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_PROMPT', {type: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_TYPE.OPEN')}),
                            );
                        });
                    });
                }).catch(() => {
                    this.dismissLoading().then(() => {
                        this.presentFail(
                            this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR'),
                            this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_PROMPT', {type: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_TYPE.RECUP')}),
                        );
                    });
                });
            }).catch(() => {
                this.dismissLoading().then(() => {
                    this.presentFail(
                        this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR'),
                            this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_PROMPT', {type: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.ERROR_TYPE.SAVE')}),
                    );
                });
            });
        } else {
            doc.save(fileName);
            this.dismissLoading();
        }
    }

    showBadgeDetail(badge: Badge) {
        this.badgeModal = badge;
        this.showBadgeModal = true;
    }

    async presentLoading() {
        this.loading = true;
        const loading = await this.loadingController.create({
            message: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.WAITING'),
        });
        await loading.present();
    }

    async dismissLoading() {
        this.loading = false;
        this.loadingController.dismiss();
    }

    async presentFail(header, message) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: [this.translate.instant('OK')]
        });

        await alert.present();
    }

    async presentSuccess() {
        const alert = await this.alertController.create({
            header: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.DOWNLOAD_FINISH'),
            message: this.translate.instant('PLAYER.SCORE.CERTIFICATE_PDF.CERTIFICATE_OBTENTION'),
            buttons: [this.translate.instant('OK')]
        });

        await alert.present();
    }
}
