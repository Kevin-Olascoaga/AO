import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-info-device',
  templateUrl: 'info-device.html'
})
export class TasksInfoPage {

  isReadyToSave: boolean;

  item: any;

  isAndroid: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform) {
    this.isAndroid = platform.is('android');
    this.item = {
      'alias': navParams.get('alias'),
      'id': navParams.get('id'),
      'version': navParams.get('version'),
      'outlets': navParams.get('outlets')
    };
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(this.item);
  }
}
