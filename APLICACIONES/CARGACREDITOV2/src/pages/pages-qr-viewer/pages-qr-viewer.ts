import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';


@IonicPage()
@Component({
  selector: 'page-pages-qr-viewer',
  templateUrl: 'pages-qr-viewer.html',
})
export class PagesQrViewerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesQrViewerPage');
    
  }

  




}
