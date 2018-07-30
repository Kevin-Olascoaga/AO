import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, LoadingController, AlertController } from 'ionic-angular';

/**
 * Generated class for the AddIrControllerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-ir-controller',
  templateUrl: 'add-ir-controller.html',
})
export class AddIrControllerPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public loading: LoadingController,
    public platform: Platform,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddIrControllerPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
