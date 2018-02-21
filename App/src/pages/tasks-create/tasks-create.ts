import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

declare var AWS: any;

@Component({
  selector: 'page-tasks-create',
  templateUrl: 'tasks-create.html'
})
export class TasksCreatePage {

  isReadyToSave: boolean;

  item: any;

  isAndroid: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public platform: Platform) {
    this.isAndroid = platform.is('android');
    this.item = {
      'taskId': navParams.get('id'),
      'deviceId': '',
      'password': '',
      'type': 'HeliosMonitor Switch',
      'alias': 'Helios Monitor',
      'out1': 'Out 1',
      'out2': 'Out 2',
      'out3': 'Out 3',
    };
    this.isReadyToSave = true;
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  check() {
    this.getData(this.item);
    console.log(this.item.deviceId);
    console.log(this.item.password);
  }

  done() {
    this.viewCtrl.dismiss(this.item);
  }

  getData(device) {
    var iotdata = new AWS.IotData({
      endpoint: 'a2iw1a66ysgipy.iot.us-west-2.amazonaws.com',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: AWS.config.region,
    });
    var params = {
      thingName: 'esp8266_' + device.deviceId /* required */
    };
    iotdata.getThingShadow(
      params
    ).promise().then((data) => {
      console.log("data", JSON.parse(data.payload));
      let datos = JSON.parse(data.payload);
      let state = datos.state.desired;
      let report = datos.state.reported;
      device.t = state.t;
      device.h = state.h;
      device.o1 = state.o1;
      device.o2 = state.o2;
      device.o3 = state.o3;
      device.version = report.metadata.version;
      device.outlets = report.metadata.outlets;
      console.log("state", state);
      console.log("device", device);
    }).catch((err) => {
      console.log('there was an error', err);
      console.log('Dispositivo no encontrado');
    });
  }
}
