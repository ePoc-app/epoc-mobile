import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'certificate-modal',
  templateUrl: './certificate-modal.component.html',
  styleUrls: ['./certificate-modal.component.scss'],
})
export class CertificateModalComponent implements OnInit {
  @Input() certificateShown: boolean;
  @Input() epocId: string;


  constructor(
    private router: Router,
  ) {}

  ngOnInit() {}

  goToCertificate() {
      this.dismissCertificateCard();
      this.router.navigateByUrl('/epoc/score/' + this.epocId);
  }

  dismissCertificateCard() {
    this.certificateShown = false;
  }

}
