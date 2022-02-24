import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../../shared/http.service';
import { Router } from '@angular/router'
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-weighter',
  templateUrl: './weighter.page.html',
  styleUrls: ['./weighter.page.scss'],
})
export class WeighterPage implements OnInit {

  constructor(public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute, private bluetoothSerial: BluetoothSerial, private alertController: AlertController, private cdr: ChangeDetectorRef,) {
    route.params.subscribe(val => {

      this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
      this.getCategoryList()
      this.records()
    });
    this.deviceConnected();
    this.myDate = new Date();
    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
  }


  dateTime() {
    this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
  }

  ngOnInit() {
    this.activeItem = ""
    this.user = localStorage.getItem("Fishery-username",)
  }

  myDate: any;
  user: any;
  dropdownVisible: any = false;
  currentDateTime: any;
  setpushdata: any = [];
  category: any;
  quality: any;
  fishquality:any;
  type: any;
  place: any;
  weight: any;
  mdy: any;
  categorylist: any = []
  locationlist: any = []
  typelist: any = []
  tableRecodrs: any = []
  buttonDisabled: boolean;
  recivedWeightValue: any;
  activeItem: any;
  hr: any;
  updateTime: any;
  showWeight: any;
  cardType: any;
  mergesdLocationList: any = []
  location: any;
  StoreTypeBasedOnCategory = [];
  StoreTypeData = [];

  backToPrivios() {
    this.router.navigate(['/center-weight-record'])
  }


  //-------------------- center button click func ----------//
  center(val) {
    this.activeItem = "center"
    this.type = val;
    this.locationlist = []
    var GetLocation = localStorage.getItem('SetLocation');
    this.locationlist = (JSON.parse((GetLocation)));
  }

  //-------------------- localsale button click func ----------//
  localsale(val) {
    this.type = val;
    this.activeItem = "localsale"
    this.locationlist = []
    var GetLocalSaleLocation = localStorage.getItem('localSaleLocation');
    this.locationlist = (JSON.parse((GetLocalSaleLocation)));
  }

  //-------------------- market button click func ----------//
  market(val) {
    this.type = val;
    this.activeItem = "market"
    this.locationlist = []
    var GetMarketLocation = localStorage.getItem('marketLocation');
    this.locationlist = (JSON.parse((GetMarketLocation)));
  }

  //-------------------- merchant button click func ----------//
  merchant(val) {
    this.type = val;
    this.activeItem = "merchant"
    this.locationlist = []
    var GetMerchantLocation = localStorage.getItem('merchantLocation');
    this.locationlist = (JSON.parse((GetMerchantLocation)));
  }

  //---------------------- Api Call func -------------//
  onlineApiCal() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    this.hr = hours + 12;

    this.updateTime = this.myDate + ' ' + hours + ":" + minutes + ":" + seconds
    console.log(this.updateTime);

    const data = {
      quality: this.fishquality,
      type: this.type,
      category: this.category,
      place: this.place,
      quantity: this.showWeight,
      isDeleted: "0",
      boxname: "box",
      updatedAt: this.updateTime
    }

    this.http.post('/manual_weight', data).subscribe((response: any) => {
      this.dateTime()
      if (response.success == "true") {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          title: 'Submited successfully.'
        })
        this.showWeight = "";
        this.type = "";
        this.place = "";
        this.quality = "";
        this.category = "";

        this.records()
      }

    }, (error: any) => {
      console.log(error);
    }
    );


  }


  //------------------ select category ------------------//
  SelectCategory(data) {
    this.StoreTypeData = [];
    const formdata = new FormData();
    formdata.append("category", data.category);
    console.log(data.category);
    this.category = data.category;

    var GetTypeBasedOnCategory = localStorage.getItem('SetTypeBasedOnCategory');
    this.StoreTypeBasedOnCategory = (JSON.parse((GetTypeBasedOnCategory)));

    for (var i = 0; i <= this.StoreTypeBasedOnCategory.length; i++) {
      const listTypeBasedOnCategory = {
        Categorypush: this.StoreTypeBasedOnCategory[i].category,
        Typepush: this.StoreTypeBasedOnCategory[i].type
      }
      if (this.category == listTypeBasedOnCategory.Categorypush) {

        this.StoreTypeData.push(listTypeBasedOnCategory.Typepush);
        console.log(this.StoreTypeData);

      }
    }
  }


  //------------------ select quality ------------------//
  SelectType(data) {
    const formdata = new FormData();
    formdata.append("type", data.type);
    this.quality = data.type;
  }

  //------------------ select location filteration ------------------//
  SelectLocation(data) {
    const formdata = new FormData();
    formdata.append("place", data.place);
    let recivedVal = data.place;
    var splitted = recivedVal.split(" - ", 2);
    this.place = splitted[0];

    if (splitted[1] == undefined) {
      this.location = '';
    } else {
      this.location = splitted[1];
    }
    console.log(this.place);
    console.log(this.location);

  }



  //--------------------- delete Api -----------------//
  delete(id) {
    const data = {
      boxid: id,
      isDeleted: "1"
    }

    this.http.post('/delete_manual_weight', data).subscribe((response: any) => {
      this.tableRecodrs = response.records;
      console.log(response);
      if (response.success == "true") {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Deleted successfully.'
        })

        this.records()

      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'error',
          title: 'Something went Wrong.'
        })
      }

    }, (error: any) => {
      console.log(error);
    }
    );
  }


  //----------------- display card records ---------------//
  records() {
    this.http.get('/list_manual_weight',).subscribe((response: any) => {
      this.tableRecodrs = response.records;
      console.log(response);

    }, (error: any) => {
      console.log(error);
    }
    );
  }


  //-------------- get category list from localstorage ------------//
  getCategoryList() {
    var GetCategory = localStorage.getItem('SetCategory');
    this.categorylist = (JSON.parse((GetCategory)));
  }

  //-------------- get quality list from localstorage ------------//
  getTypeList() {
    var GetType = localStorage.getItem('SetType');
    this.typelist = (JSON.parse((GetType)));

  }


  //----------- navigate to setting page ----------//
  navigateToSettings() {
    this.router.navigate(['/centerweight-auto-dashboard'])
  }


  dosomething(event) {
    setTimeout(() => {
      event.target.complete();
      this.refresh()
    }, 1500);
  }

  refresh() {
    //----------- Category Local Storage --------------//
    this.http.get('/list_category',).subscribe((response: any) => {
      var SetCategory = (JSON.stringify(response.records));
      localStorage.setItem('SetCategory', SetCategory);
    }, (error: any) => {
      console.log(error);
    }
    );

    //----------- Type Local Storage --------------//
    this.http.get('/list_type',).subscribe((response: any) => {
      var SetType = (JSON.stringify(response.records));
      localStorage.setItem('SetType', SetType);
    }, (error: any) => {
      console.log(error);
    }
    );

    //----------- Location Local Storage --------------//
    this.http.get('/list_location',).subscribe((response: any) => {
      var SetLocation = (JSON.stringify(response.records));
      localStorage.setItem('SetLocation', SetLocation);
    }, (error: any) => {
      console.log(error);
    });



  }
  //----------------- divice connect func ------------//
  deviceConnected() {
    this.bluetoothSerial.subscribeRawData().subscribe((dt) => {
      this.bluetoothSerial.read().then((dd) => {
        this.onDataReceive(dd);
        this.cdr.detectChanges();
      });
    });
  }

length:any = 1;
  //----------- weighing scale recived data ---------//
  onDataReceive(val) {
    var data = JSON.stringify(val)
    this.recivedWeightValue = Math.round(val * 100) / 100;

    for(var i=0;i=length;){
      if (this.recivedWeightValue == this.recivedWeightValue) {
        this.showWeight = this.recivedWeightValue
      }
      this.length = 0;
    }

    if(this.recivedWeightValue != this.recivedWeightValue){
        this.showWeight = this.recivedWeightValue;
        this.length = 1;
    }

    this.cdr.detectChanges(); // or here
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }

}
