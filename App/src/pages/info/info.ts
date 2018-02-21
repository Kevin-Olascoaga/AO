import { Component } from '@angular/core';

@Component({
  selector: 'page-info',
  templateUrl: 'info.html'
})
export class InfoPage {

  public barChartOptions:any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    public barChartLabels:string[] = ['Recámara 1', 'Baño', 'Estudio', 'Recámara 2', 'Sala', 'Comedor'];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
    public barChartColors:any = [{
      backgroundColor: 'rgba(0,150,64,0.5)',
      borderColor: 'rgba(0,150,64,1)',
      pointBackgroundColor: 'rgba(0,150,64,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,150,64,0.8)'
    }];
   
    public barChartData:any[] = [
      {data: [65, 59, 80, 81, 56, 55], label: 'Usage'}
    ];
   
    // events
    public chartClicked(e:any):void {
      console.log(e);
    }
   
    public chartHovered(e:any):void {
      console.log(e);
    }
   
    public randomize():void {
      // Only Change 3 values
      let data = [
        Math.round(Math.random() * 100),
        59,
        80,
        (Math.random() * 100),
        56,
        (Math.random() * 100),
        40];
      let clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = data;
      this.barChartData = clone;
      /**
       * (My guess), for Angular to recognize the change in the dataset
       * it has to change the dataset variable directly,
       * so one way around it, is to clone the data, change it and then
       * assign it;
       */
    }
}
// HELIOS_MONITOR_CC96FE