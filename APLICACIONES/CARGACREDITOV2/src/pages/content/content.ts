import { Component, Input, Output, OnInit } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
// import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
// import { FirebaseApp } from 'angularfire2';
// import { firestore } from 'firebase/app';

// import { MainPage } from '../pages';
// import { ScanPage } from "../pages";
import { Usuario } from '../../clases/usuario';
import { Credito } from '../../clases/credito';
import { PagesModalPage } from "../pages-modal/pages-modal";
// import { SpinnerPage } from "../../pages/pages-spinner/pages-spinner";

@IonicPage()
@Component({
  selector: 'content',
  templateUrl: 'content.html'
})
export class ContentPage implements OnInit {
  // private coleccionTipadaFirebase: AngularFirestoreCollection<Credito>;
  private ListadoCreditosObservable: Observable<Credito[]>;
  private Arr: Credito[];
  private scanSub;
  public credito: number;
  public usuario: Usuario;
  private spinner;

  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    private qrScanner: QRScanner, 
    // private objFirebase: AngularFirestore, 
    platform: Platform
  ) {

    this.usuario = JSON.parse(sessionStorage.getItem('usuario'));
    platform.registerBackButtonAction(() => {
      this.qrScanner.hide();
      this.scanSub.unsubscribe();
      this.showElements();
      //this.spin(false);
    }, 1);
    this.traerCreditoUsuario();

  }

  ngOnInit() {
    window.document.getElementById('box').hidden = true;
  }

  hideElements() {
    window.document.querySelector('ion-content').classList.add('transparentBody');
    window.document.querySelector('ion-app').classList.add('transparentBody');
    window.document.getElementById('fondo').classList.remove('contenido');
    //window.document.getElementById('formulario').setAttribute('display', 'none');
    window.document.getElementById('header').hidden = true;
    window.document.getElementById('btn').hidden = true;
    window.document.getElementById('btn_2').hidden = true;
    window.document.getElementById('btn_3').hidden = true;
    window.document.getElementById('btn_4').hidden = true;
    window.document.getElementById('item').hidden = true;
    window.document.getElementById('lbl_1').hidden = true;
    window.document.getElementById('lbl_2').hidden = true;
    window.document.getElementById('footer').hidden = true;
    window.document.getElementById('box').hidden = false;
  }

  Modal(titulo: string, data: any) {
    this.modalCtrl.create(PagesModalPage, { titulo: titulo, data: data }).present();
  }

  showElements() {
    window.document.querySelector('ion-content').classList.remove('transparentBody');
    window.document.querySelector('ion-app').classList.remove('transparentBody');
    window.document.getElementById('fondo').classList.add('contenido');
    //window.document.getElementById('formulario').setAttribute('display', 'initial');
    window.document.getElementById('header').hidden = false;
    window.document.getElementById('btn').hidden = false;
    window.document.getElementById('btn_2').hidden = false;
    window.document.getElementById('btn_3').hidden = false;
    window.document.getElementById('btn_4').hidden = false;
    window.document.getElementById('item').hidden = false;
    window.document.getElementById('lbl_1').hidden = false;
    window.document.getElementById('lbl_2').hidden = false;
    window.document.getElementById('footer').hidden = false;
    window.document.getElementById('box').hidden = true;
  }

  goScan(option?: number) {
    this.hideElements();
    // this.spin(false);
    // Optionally request the permission early
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        //alert('authorized');
        // start scanning
        this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
          //console.log('Scanned something', text);
          if(option !== undefined && option == 1) {
            this.verificarCodigoUsuario(text);
          } else {
            this.agregarCredito(text);
          }
          
          this.qrScanner.hide(); // hide camera preview
          this.scanSub.unsubscribe(); // stop scanning
          
          this.showElements();
          //this.navCtrl.pop();
        });
        this.qrScanner.resumePreview();
        // show camera preview
        this.qrScanner.show()
        .then((data : QRScannerStatus)=> { 
          //console.log('datashowing', data.showing);
          //alert(data.showing);
        },err => {
          // this.spin(false);
          this.Modal('Error: ', 'Detalles: '+ err);
        });

        // wait for user to scan something, then the observable callback will be called

      } else if (status.denied) {
        // this.spin(false);
        this.Modal('Permisos', 'Permisos a la cámara denegados.');
        // camera permission was permanently denied
        // you must use QRScanner.openSettings() method to guide the user to the settings page
        // then they can grant the permission from there
      } else {
        // permission was denied, but not permanently. You can ask for permission again at a later time.
        // this.spin(false);
        this.Modal('Permisos', 'Permisos a la cámara denegados. Elija Aceptar la próxima vez.');
      }
    })
    .catch((e: any) => {
      // this.spin(false);
      this.Modal('Error: ', 'Detalles: '+ e);
    });
  }

  agregarCredito(codigo: string) {
    console.info('AgregarCredito código: '+ codigo);
    // this.spin(true);
    let credito: number = 0;
    let cred: Credito;

      cred = this.Arr.find( elem => {
        return elem.codigo == codigo;
      });

      if(cred === undefined) {
        this.guardarCredito(codigo);
      } else if(cred !== undefined ) {
        // this.spin(false);
        this.Modal('Información', '¡Código ya cargado!');
      }
    
  }
  
  guardarCredito(codigo: string) {
    // this.spin(true);
    let nuevo: Credito;
    nuevo = new Credito(codigo);
    nuevo.usuario_id = this.usuario.id;
    let objetoJsonGenerico = nuevo.dameJSON();
    console.log (objetoJsonGenerico );

    // this.objFirebase.collection<Credito>('creditos').add(objetoJsonGenerico).then(
    //   Retorno => {
    //     console.log(`id= ${Retorno.id} ,  mensaje= ${Retorno.path}`);
        
    //     //this.traerCreditoUsuario();
    //     this.spin(false);
    //     this.Modal('Código cargado', 'El código N°  '+codigo+'  ha sido cargado al usuario '+this.usuario.nombre);
    //   }
    // ).catch( error => {
    //   this.spin(false);
    //   console.error(error);
    //   this.Modal('Error', 'Detalle: '+error);
    // });
  }

  traerCreditoUsuario() {
    // this.spin(true);
    let credito: number = 0;
    let arr: Array<Credito> = new Array<Credito>();
    // this.coleccionTipadaFirebase = this.objFirebase.collection<Credito>('creditos', ref => ref.where('usuario_id', '==', this.usuario.id) );
    // this.ListadoCreditosObservable = this.coleccionTipadaFirebase.valueChanges();
    // this.ListadoCreditosObservable.subscribe(x => {
    //   credito = 0;
    //   console.info("Conexión correcta con Firebase: creditos del usuario: ", x);
    //   this.Arr = x;
    //   x.forEach(cre => {
    //     credito += cre.valor;
    //   });
    //   this.credito = credito;
    //   this.spin(false);
    // });
  }
  
  borrarCreditoUsuario() {
    // this.spin(true);
    // let ob = this.objFirebase.collection<Credito>('creditos', ref => ref.where('usuario_id', '==', this.usuario.id)).ref.get();
    // ob.then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     if(doc.data().usuario_id == this.usuario.id) doc.ref.delete();
    //   });
    // }).then(() => {
    //   this.spin(false);
    //   this.Modal('Información', "Se borraron todos los créditos del usuario "+this.usuario.nombre);
    // }).catch((error) => {
    //   this.spin(false);
    //   this.Modal('Error', "Error borrando los créditos: " + error);
    // });
  }

  verificarCodigoUsuario(codigo: string) {
    // this.spin(true);
    // let ob = this.objFirebase.collection<Credito>('creditos', ref => ref.where('usuario_id', '==', this.usuario.id)).ref.get();
    // ob.then((querySnapshot) => {
    //   let data: string = 'El código NO está cargado, \nN°. '+codigo+'\nUsuario: '+this.usuario.nombre;
    //   querySnapshot.forEach((doc) => {
    //     if(codigo.indexOf(doc.data().codigo) != -1) {
    //       data = 'El código YA está cargado, \nN°. '+codigo+'\nUsuario: '+this.usuario.nombre;
    //     }
    //   });
    //   this.spin(false);
    //   this.Modal('Información', data);
    // }).catch((error) => {
    //   this.spin(false);
    //   this.Modal('Error', "Error verificando el código: \n" + error);
    // });
  }

  traerCodigos() {
    // this.spin(true);
    // let data: string = "Códigos en la base de datos para el usuario "+this.usuario.nombre+":\n\n\n\n";
    // this.coleccionTipadaFirebase = this.objFirebase.collection<Credito>('creditos', ref => ref.where('usuario_id', '==', this.usuario.id) );
    // this.ListadoCreditosObservable = this.coleccionTipadaFirebase.valueChanges();
    // let ob = this.ListadoCreditosObservable.subscribe(x => {
    //   x.forEach(cre => {
    //     data += cre.codigo + '\n';
    //   });
    //   ob.unsubscribe();
    //   this.spin(false);
    //   this.Modal('Códigos', data);
    // });
  }

  // private spin(status: boolean) {
  //   if(this.spinner === undefined && status === true) {
  //     // this.spinner = this.modalCtrl.create(SpinnerPage);
  //     this.spinner.present();
  //   } else if(this.spinner !== undefined && status === false) {
  //     this.spinner.dismiss();
  //     this.spinner = undefined;
  //   }
  // }

}
