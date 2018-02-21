import { Component } from '@angular/core';
import { LoadingController,AlertController, Tabs } from 'ionic-angular';
import { NavController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html'
})
export class SyncPage {

  public device: any = {};

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public loading: LoadingController,
              private alertCtrl: AlertController) {
  }

  addDevice(){
    let loader = this.loading.create({
        content: 'Press the sync button on device...',
      });

    loader.present().then(() => {
      setTimeout(()=>{
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Pair succesful',
          subTitle: 'Paired to device "' + this.device.nombre + '" with alias: ' + this.device.id,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                // this.navCtrl.push(TasksPage);
                var t: Tabs = this.navCtrl.parent;
                t.select(0);
              }
            }]
        });
        alert.present();
      },5000);
    });
  }

}
// HELIOS_MONITOR_CC96FE