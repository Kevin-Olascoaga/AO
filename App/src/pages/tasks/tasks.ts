import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';
import { TasksCreatePage } from '../tasks-create/tasks-create';
import { TasksEditPage } from '../tasks-edit/tasks-edit';
import { TasksInfoPage } from '../info-device/info-device';

import { DynamoDB, User } from '../../providers/providers';

declare var AWS: any;

@Component({
  selector: 'page-tasks',
  templateUrl: 'tasks.html'
})
export class TasksPage {

  public items: any;
  //public obj: string = "";
  public refresher: any;
  private taskTable: string = 'ionic-mobile-hub-tasks';

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public user: User,
              public db: DynamoDB) {

    this.refreshTasks();
  }

  refreshData(refresher) {
    this.refresher = refresher;
    this.refreshTasks()
    console.log(AWS.config.credentials);
  }

  refreshTasks() {
    var iot = new AWS.Iot();
    var params = {
        policyName: 'PolicyHelios',
        principal: AWS.config.credentials.identityId
    };
    console.log(AWS.config.credentials.identityId);
    iot.attachPrincipalPolicy(params, function(err, data) {
    });


    this.db.getDocumentClient().query({
      'TableName': this.taskTable,
      'IndexName': 'DateSorted',
      'KeyConditionExpression': "#userId = :userId",
      'ExpressionAttributeNames': {
        '#userId': 'userId',
      },
      'ExpressionAttributeValues': {
        ':userId': AWS.config.credentials.identityId
      },
      'ScanIndexForward': false
    }).promise().then((data) => {
      this.items = data.Items;
      for (let device of this.items){
        this.getData(device);
      }
      if (this.refresher) {
        this.refresher.complete();
      }
    }).catch((err) => {
      console.log(err);
    });

    console.log(this.items);




  }

  generateId() {
    var len = 16;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLength = chars.length;
    var result = "";
    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
    for(var i = 0; i < len; i++) {
      result += chars[randoms[i] % charLength];
    }
    return result.toLowerCase();
  }

  addTask() {
    let id = this.generateId();
    let addModal = this.modalCtrl.create(TasksCreatePage, { 'id': id });
    addModal.onDidDismiss(item => {
      if (item) {
        item.userId = AWS.config.credentials.identityId;
        item.created = (new Date().getTime() / 1000);
        this.db.getDocumentClient().put({
          'TableName': this.taskTable,
          'Item': item,
          'ConditionExpression': 'attribute_not_exists(id)'
        }, (err, data) => {
          if (err) { console.log(err); }
          this.refreshTasks();
        });
      }
    })
    addModal.present();
  }

  editTask(task,index) {
    console.log(task);
    let addModal = this.modalCtrl.create(TasksEditPage, {
      'alias': task.alias,
      'out1': task.out1,
      'out2': task.out2,
      'out3': task.out3
    });
    addModal.onDidDismiss(item => {
      if (item) {
        console.log(item);
        var params = {
          'ExpressionAttributeNames': {
           "#A": "alias",
           "#O1": "out1",
           "#O2": "out2",
           "#O3": "out3"
          },
          'ExpressionAttributeValues': {
           ":a": item.alias,
           ":o1": item.out1,
           ":o2": item.out2,
           ":o3": item.out3
          },
         'Key': {
           'userId': AWS.config.credentials.identityId,
           'taskId': task.taskId
         },
         'TableName': this.taskTable,
         'UpdateExpression': "SET #A = :a, #O1 = :o1, #O2 = :o2, #O3 = :o3"
        };
        this.db.getDocumentClient().update(params, (err, data) => {
          if (err) { console.log(err); }
          this.refreshTasks();
        });
      }
    })
    addModal.present();
  }

  deleteTask(task, index) {
    this.db.getDocumentClient().delete({
      'TableName': this.taskTable,
      'Key': {
        'userId': AWS.config.credentials.identityId,
        'taskId': task.taskId
      }
    }).promise().then((data) => {
      this.items.splice(index, 1);
    }).catch((err) => {
      console.log('there was an error', err);
    });
  }

  postData(onOff,device,number){
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
      payload: (onOff) ? '{\n \"state\":{\n \"desired\":{\n \"' + number + '\": true \n}\n}\n}' : '{\n \"state\":{\n \"desired\":{\n \"' + number + '\": false \n}\n}\n}' /* Strings will be Base-64 encoded on your behalf */,
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

  updateData(device){
    var iotdata = new AWS.IotData({
      endpoint: 'a2iw1a66ysgipy.iot.us-west-2.amazonaws.com',
      accessKeyId: AWS.config.credentials.accessKeyId,
      secretAccessKey: AWS.config.credentials.secretAccessKey,
      sessionToken: AWS.config.credentials.sessionToken,
      region: AWS.config.region,
    });
    var params = {
      //topic: tema
      thingName: 'esp8266_' + device.deviceId, /* required */
      payload: '{\n \"state\":{\n \"desired\":{\n \"updateData\": true \n}\n}\n}',
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

  infoData(device,index){
    // var iotdata = new AWS.IotData({
    //   endpoint: 'a2iw1a66ysgipy.iot.us-west-2.amazonaws.com',
    //   accessKeyId: AWS.config.credentials.accessKeyId,
    //   secretAccessKey: AWS.config.credentials.secretAccessKey,
    //   sessionToken: AWS.config.credentials.sessionToken,
    //   region: AWS.config.region,
    // });
    // var params = {
    //   thingName: 'esp8266_' + device.deviceId /* required */
    // };
    // iotdata.getThingShadow(params, function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log("data",JSON.parse(data.payload));           // successful response
    // }).promise().then((data) => {
    //   let datos = JSON.parse(data.payload);
    //   let report = datos.state.reported;
    //   console.log("reported", report);
    //   console.log("ota", report.metadata);
    //   device.version = report.metadata.version;
    //   device.outlets = report.metadata.outlets;
      console.log("device",device);
      let addModal = this.modalCtrl.create(TasksInfoPage, {
        'alias': device.alias,
        'id': device.deviceId,
        'version': device.version,
        'outlets': device.outlets
      });
      addModal.present();

    // console.log("hi",device);
    // let addModal = this.modalCtrl.create(TasksInfoPage, {
    //   'alias': device.alias,
    //   'id': device.deviceId,
    //   'version': device.alias,
    //   'outlets': device.outlets
    // });
    // console.log("hi",device);
    // addModal.present();
  }

  timer(device,output){
    console.log(device);
    console.log(output);
  }
}
