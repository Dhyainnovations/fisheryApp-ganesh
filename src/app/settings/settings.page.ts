import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {


  constructor(private router: Router, private bluetoothSerial: BluetoothSerial, private alertController: AlertController, private cdr: ChangeDetectorRef, route: ActivatedRoute,) {
    route.params.subscribe(val => {
      this.user = localStorage.getItem("Fishery-username",)
   
    });
    this.CheckBluetoothIsConnected();
    this.Locallogintype = localStorage.getItem("logintype",)
    this.Localpermission = localStorage.getItem("permission",)
    this.printerBluetoothId = localStorage.getItem("printerBluetoothId",);
  }

  ngOnInit() {
  }
  user: any;
  Locallogintype: any;
  Localpermission: any;
  printerBluetoothId: any;
  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: boolean;

  backToPrivios() {
    this.router.navigate(['/centerweight-auto-weighter'])

  }

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
            this.connectedId = id;
            localStorage.setItem('printerBluetoothId', this.connectedId);
          }
        }
      ]
    });
    await alert.present();
  }

  connectedId: any = "";
  success = (data) => {
    this.bluetoothSerial.write("Printer Successfully Connected" + this.connectedId);
    this.bluetoothSerial.disconnect();
  }
  fail = (error) => {
    alert(error);
  }


  CheckBluetoothIsConnected() {
    this.bluetoothSerial.isEnabled().then(
      () => {
        this.bluetoothtoggle = true;
      },
      () => {
        this.bluetoothtoggle = false;
      }
    )
  }

  bluetoothtoggle: any = false;

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


  

  logout() {
    localStorage.clear()
    
    this.router.navigate(['/loginpage'])
  }

}