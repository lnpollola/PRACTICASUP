import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, ActionSheetController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'WelcomePage',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  
  loginFields: { email: string, password: string } = {
    email: '',
    password: ''
  };

    // Our translated text strings
    private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public actionSheetCtrl: ActionSheetController,
  ) {
    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
   }

  login() {
    this.navCtrl.push('LoginPage');
  }

  doLogin() {
    this.user.login(this.loginFields).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  
  mostrarUsuarios(){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ingresar como...',
      enableBackdropDismiss: true,
      cssClass: 'actSheet',
      buttons: [
        { text: 'admin', handler: () => {this.setLog(1);}},
        { text: 'invitado', handler: () => {this.setLog(2);}},
        { text: 'usuario', handler: () => {this.setLog(3);}},
        { text: 'anonimo', handler: () => {this.setLog(4);}},
        { text: 'tester', handler: () => {this.setLog(5);}},
        {
          text: 'Cancelar', cssClass: 'btnCancel', role: 'cancel', handler: () => {  }
        }
      ]
    });
    actionSheet.id = 'actSheet';
    actionSheet.present();
  }

  setLog(i: number) {
    switch (i) {
      case 1:
        this.loginFields.email = "admin@gmail.com";
        this.loginFields.password = '11';
        break;

      case 2:
      this.loginFields.email = "invitado@gmail.com";
      this.loginFields.password = '22';
        break;

      case 3:
      this.loginFields.email = "usuario@gmail.com";
      this.loginFields.password = '33';
        break;

      case 4:
      this.loginFields.email = "anonimo@gmail.com";
      this.loginFields.password = '44';
        break;

      case 5:
      this.loginFields.email = "tester@gmail.com";
      this.loginFields.password = '55';
        break;
    
      default:
        break;
    }
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }
}