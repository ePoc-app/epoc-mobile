import {Component, Input, OnInit} from '@angular/core';
import {SettingsStoreService} from '../../services/settings-store.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
})
export class DebugComponent implements OnInit {
  @Input() epocId;
  @Input() chapterId;
  @Input() contentId;

  settings;

  mail;
  subject;
  body;
  mailto ;

  constructor(
      private settingsStore: SettingsStoreService
  ) { }

  ngOnInit() {
    this.settingsStore.settings$.subscribe(settings => {
      if (settings) {
        this.settings = settings;
      }
    });

    this.mail = 'ill-epoc-contact@inria.fr';
    this.subject = '?subject=Commentaire ePoc';
    this.body = `&body=`+encodeURIComponent(`Ce contenu bug : epoc/${this.epocId}/${this.chapterId}/content/${this.contentId}\r\nDécrivez le problème en donnant le plus de détails pour le reproduire:\r\n- ...`)
    this.mailto = `mailto:${this.mail}${this.subject}${this.body}`
  }

}
