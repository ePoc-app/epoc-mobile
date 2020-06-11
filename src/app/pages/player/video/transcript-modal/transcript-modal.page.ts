import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import * as VTT from 'vtt.js';

@Component({
    selector: 'transcript-modal',
    templateUrl: './transcript-modal.page.html'
})
export class TranscriptModalPage implements OnInit {

    @Input() file: string;

    transcript;

    constructor(private modalCtrl: ModalController, private http: HttpClient) {
    }

    ngOnInit() {
        this.http.get(this.file, {responseType: 'text'}).subscribe(data => {
            const WebVTT = VTT.WebVTT;
            const parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
            const cues = [];

            parser.oncue = (cue) => {
                cues.push(cue);
            };

            parser.parse(data);
            parser.flush();

            const text = cues.reduce((accumulator, currentValue) => accumulator + ' ' + currentValue.text, '');

            this.transcript = '<p>' + text.split('.').join('.</p><p>') + '</p>';
        });
    }

    dismiss() {
        this.modalCtrl.dismiss({
            dismissed: true
        });
    }
}
