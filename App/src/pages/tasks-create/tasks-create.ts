import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform, LoadingController, AlertController } from 'ionic-angular';

declare var AWS: any;

@Component({
  selector: 'page-tasks-create',
  templateUrl: 'tasks-create.html'
})
export class TasksCreatePage {

  isReadyToSave: boolean;
  search: boolean;
  add: boolean;

  item: any;

  isAndroid: boolean;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public loading: LoadingController,
              public platform: Platform,
              private alertCtrl: AlertController) {
    this.isAndroid = platform.is('android');
    this.item = {
      'taskId': navParams.get('id'),
      'deviceId': '',
      // 'password': '',
      // 'type': 'HeliosMonitor Switch',
      'alias': 'Atomoff',
      'out1': 'Out 1',
      'out2': 'Out 2',
      'out3': 'Out 3',
    };
    this.isReadyToSave = true;
    this.search = true;
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  check() {
    this.getData(this.item);
    let loader = this.loading.create({
        content: 'Searching ...',
      });
    loader.present();
    setTimeout(()=>{
      loader.dismiss();
      console.log(this.item.deviceId);
      console.log(this.item.error);

      if (this.item.error){
        console.log("rayos");
        let alert = this.alertCtrl.create({
          title: 'Device not found',
          subTitle: 'Please check the device information and try again',
          buttons: [
            {
              text: 'Ok',
            }]
        });
        alert.present();
      }else{
        console.log("Found")
        this.postData(this.item, true);
        let loaderSync = this.loading.create({
            content: 'Press sync button on the device ... (It will check the status after 10 seconds from now)',
          });
        loaderSync.present();
        setTimeout(()=>{
          loaderSync.dismiss();
          this.getData(this.item);
          let loaderCheck = this.loading.create({
              content: 'Checking status ...',
            });
          loaderCheck.present();
          setTimeout(()=>{
            loaderCheck.dismiss();
            this.postData(this.item, false);
            if (this.item.sync){
              this.add = true;
              this.search = false;
            }else{
              let alertCheck = this.alertCtrl.create({
                title: 'Device not sync',
                subTitle: 'The user did not press the sync button or the time was over',
                buttons: [
                  {
                    text: 'Ok',
                  }]
              });
              alertCheck.present();
            }
          },1000);

        },10000);
      }
    },1000);
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
      device.sync = state.sync;
      device.version = report.metadata.version;
      device.outlets = report.metadata.outlets;
      device.error = false;
      console.log("state", state);
      console.log("device", device);
    }).catch((err) => {
      device.error = true;
      console.log('there was an error', err);
      console.log('Dispositivo no encontrado');
    });
  }

  postData(device,state){
    console.log('Entro a post data');
    var iotdata = new AWS.IotData({
      endpoint: 'a2iw1a66ysgipy.iot.us-west-2.amazonaws.com',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: AWS.config.region,
    });
    //var tema = '/HeliosMonitor/Devices/HeliosMonitor_' + device.deviceId + '/' + number; /* required */
    //console.log(tema);
    var params = {
      //topic: tema
      thingName: 'esp8266_' + device.deviceId, /* required */
      payload: (state) ? '{\n \"state\":{\n \"desired\":{\n \"setsync\": true \n}\n}\n}' : '{\n \"state\":{\n \"desired\":{\n \"setsync\": false, \"sync\": false \n}\n}\n}'  /* Strings will be Base-64 encoded on your behalf */,
      //qos: 0
    };
    iotdata.updateThingShadow(
      params
    ).promise().then((data) => {
      console.log("data", JSON.parse(data.payload));
    }).catch((err) => {
      console.log('there was an error', err);
    });
  }

}
