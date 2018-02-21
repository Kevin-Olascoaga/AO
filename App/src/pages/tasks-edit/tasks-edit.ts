import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-tasks-edit',
  templateUrl: 'tasks-edit.html'
})
export class TasksEditPage {

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
      'out1': navParams.get('out1'),
      'out2': navParams.get('out2'),
      'out3': navParams.get('out3')
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
