import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../../shared/http.service';
import Swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Network } from '@awesome-cordova-plugins/network/ngx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private router: Router, private bluetoothSerial: BluetoothSerial, private alertController: AlertController, private cdr: ChangeDetectorRef, private network: Network, public datepipe: DatePipe, public navCtrl: NavController, private route: ActivatedRoute, private http: HttpService,) {
    route.params.subscribe(val => {

      window.addEventListener('offline', () => {
        this.checkoffline = true;
        this.offlineAlart = true
        this.onlineAlart = false;

      });
      window.addEventListener('online', () => {

        this.onlineAlart = true;
        this.offlineAlart = false
        this.checkonline = true;

      });
      
    });
    this.user = localStorage.getItem("Fishery-username",)
  }

  ngOnInit() {

  }

  user: any;
  checkoffline: any;
  checkonline: any;
  buttonDisabled: boolean;
  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: boolean;
  onlineAlart: any = true;
  offlineAlart: any = false
  disableSts: any = false;
  

  //------------- navigate to privios page -------------//
  backToPrivios() {
    this.router.navigate(['/center-weight-record']);

  }

  //------------- bluetooth scan func ----------------//
  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    const unPair = [];
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      success.forEach((value, key) => {
        var exists = false;
        unPair.forEach((val2, i) => {
          if (value.id === val2.id) {
            exists = true;
          }
        });
        if (exists === false && value.id !== '') {
          unPair.push(value);
        }
      });
      this.unpairedDevices = unPair;
      this.gettingDevices = false;
    },
      (err) => {
        console.log(err);
      });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      });
  }


  //----------------- bluetooth disconnect --------------//
  async disconnect() {
    const alert = await this.alertController.create({
      header: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    await alert.present();
  }


  //--------------- divice selection -----------//
  async selectDevice(id: any) {
    const alert = await this.alertController.create({
      header: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    await alert.present();
  }

  //------------- if success -------//
  success = (data) => {
    alert("Successfully Connected");
  
    localStorage.setItem("bluetoothStatus", "connected")
    this.router.navigate(['/centerweight-auto-weighter']);
  }

  //------------ if fails -----------//
  fail = (error) => {
    alert(error);
    
  }

  //---------------- bluetooth enable func ----------------//
  enablebluetooth() {
    this.bluetoothSerial.enable().then(
      () => {
        alert("Bluetooth is enabled");
        this.startScanning();
      }, () => {
        alert("The user did not enable Bluetooth");
      }
    );
  }

  //--------------- logout ----------//
  logout() {
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }

}