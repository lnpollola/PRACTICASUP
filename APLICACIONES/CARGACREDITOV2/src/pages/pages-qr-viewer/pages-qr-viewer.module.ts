import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesQrViewerPage } from './pages-qr-viewer';

@NgModule({
  declarations: [
    PagesQrViewerPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesQrViewerPage),
  ],
})
export class PagesQrViewerPageModule {}
