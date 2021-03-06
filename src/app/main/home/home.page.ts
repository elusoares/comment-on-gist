import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';
import { ModalController, AlertController } from '@ionic/angular';

import { OpenGistPage } from '../open-gist/open-gist.page';
import { AuthenticationService } from 'src/app/shared/authentication/authentication-service/authentication.service';
import { AlertService } from 'src/app/shared/alert-service/alert.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userName: string;
  options: BarcodeScannerOptions;
  navigationExtras: NavigationExtras;
  gotUrl: boolean;
  gistId: string;
  ok: boolean;
  constructor(
    // usei BarcodeScanner porque o QRScanner tava muito chato de configurar
    // ficava se escondendo atras da pagina, tinha que usar window pra aplicar uma class css
    private barcodeScanner: BarcodeScanner,
    public modalController: ModalController,
    private alertController: AlertController,    
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.options = {
      prompt: 'Place a QR Code inside the viewfinder rectangle',
      formats: 'QR_CODE'
    };
    this.ok = true;
  }

  ionViewWillEnter() {
    this.getUserData();
    this.getUserAvatar();
  }

  getUserData() {
      this.authenticationService.userGuard()
        .subscribe((user) => {
          this.userName = user.name;
        });
  }

  getUserAvatar() {
    this.authenticationService.getAvatar()
      .then((avatar) => {
        const blob = new Blob([avatar], { type: 'image/jpeg' });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  scant() {
    this.presentModal();
  }

  scan() {
    // this.gotUrl = false;
    this.barcodeScanner.scan(this.options).then(qrCodeData => {
      console.log('Barcode data', qrCodeData);
      const url = qrCodeData.text;
      // testa se o link é do github
      if (url !== '') {
        if (qrCodeData.text.includes('gist.github.com')) {
          const urlSplit = qrCodeData.text.split('/');
          // se for, pega a ultima parte do link que é o id
          this.gistId = urlSplit[urlSplit.length - 1];
          this.router.navigate(['/root/home/open-gist', {gist_id: this.gistId}]);
          // this.presentModal();
        } else {
          // se nao, dá um recadinho pro usuario
          this.alertService.presentAlert('Ops...', 'This is not a valid link.');
        }
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: OpenGistPage,
      cssClass: 'my-modal',
      componentProps: {
        gistId: this.gistId,
      }
    });
    return await modal.present();
  }
}
