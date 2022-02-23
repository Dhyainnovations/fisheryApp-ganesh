import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../../shared/http.service';
import { Router } from '@angular/router'
import { Network } from '@awesome-cordova-plugins/network/ngx';
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

  constructor(public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute, private network: Network, private bluetoothSerial: BluetoothSerial, private alertController: AlertController, private cdr: ChangeDetectorRef,) {
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

  myDate:any;
  user: any;
  dropdownVisible: any = false;
  currentDateTime: any;
  setpushdata: any = [];
  category: any;
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
  hr:any;
  updateTime:any;
  cardType: any;
  mergesdLocationList: any = []


  backToPrivios() {
    this.router.navigate(['/center-weight-record'])
  }


  center(val) {
    this.activeItem = "center"
    this.type = val;
    console.log(this.type);

    if(this.type == "center"){
      this.locationlist = []
      var GetLocation = localStorage.getItem('SetLocation');
      this.locationlist = (JSON.parse((GetLocation)));
      console.log(this.locationlist);
    }

    // this.http.get('/list_center_place',).subscribe((response: any) => {
    //   this.locationlist = response.records;
    //   console.log(response);

    // }, (error: any) => {
    //   console.log(error);
    // }
    // );



  }

  localsale(val) {

    this.type = val;
    this.activeItem = "localsale"
    console.log(val);
    // this.http.get('/list_localsale_place',).subscribe((response: any) => {
    //   this.locationlist = response.records;
    //   console.log(response);

    // }, (error: any) => {
    //   console.log(error);
    // }
    // );
    if(this.type == "localsale"){
      this.locationlist = []
      var GetLocalSaleLocation = localStorage.getItem('localSaleLocation');
      console.log(GetLocalSaleLocation);
      this.locationlist = (JSON.parse((GetLocalSaleLocation)));
      console.log(this.locationlist);
    }

  }

  market(val) {
    this.type = val;
    this.activeItem = "market"
    console.log(val);
    // this.http.get('/list_market',).subscribe((response: any) => {
    //   this.locationlist = response.records;
    //   console.log(response);

    // }, (error: any) => {
    //   console.log(error);
    // }
    // );

    if(this.type == "market"){
      this.locationlist = []
      var GetMarketLocation = localStorage.getItem('marketLocation');
      console.log(GetMarketLocation);
      this.locationlist = (JSON.parse((GetMarketLocation)));
      console.log(this.locationlist);
    }

  }
  merchant(val) {
    this.type = val;
    this.activeItem = "merchant"
    console.log(val);
    // this.http.get('/list_merchant',).subscribe((response: any) => {
    //   this.locationlist = response.records;
    //   console.log(response);

    // }, (error: any) => {
    //   console.log(error);
    // }
    // );

    if(this.type == "merchant"){
      this.locationlist = []
      var GetMerchantLocation = localStorage.getItem('merchantLocation');
      console.log(GetMerchantLocation);
      this.locationlist = (JSON.parse((GetMerchantLocation)));
      console.log(this.locationlist);
      
    }

  }


  

  onlineApiCal() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    this.hr = hours + 12;

    this.updateTime = this.myDate + ' ' + hours + ":" + minutes + ":" + seconds
    console.log(this.updateTime);

    const data = {
      quality: this.type,
      type: "center",
      category: this.category,
      place: this.place,
      quantity: this.recivedWeightValue,
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

        this.weight = "";

        this.records()
      }

    }, (error: any) => {
      console.log(error);
    }
    );


  }


  SelectType(data) {
    const formdata = new FormData();
    formdata.append("type", data.type);
    this.type = data.type;
  }

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

  location: any;
  StoreTypeBasedOnCategory = [];
  StoreTypeData = [];

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
          timer: 2000,
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
          timer: 2000,
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

  records() {
    this.http.get('/list_manual_weight',).subscribe((response: any) => {
      this.tableRecodrs = response.records;
      console.log(response);

    }, (error: any) => {
      console.log(error);
    }
    );
  }



  getCategoryList() {
    var GetCategory = localStorage.getItem('SetCategory');
    this.categorylist = (JSON.parse((GetCategory)));
  }

  getTypeList() {
    var GetType = localStorage.getItem('SetType');
    this.typelist = (JSON.parse((GetType)));

  }



  navigateToSettings() {
    this.router.navigate(['/settings'])
  }


  dosomething(event) {
    setTimeout(() => {
      event.target.complete();

      this.refresh()

    }, 1500);
  }



  checkboxsts: any = false

  dropdownOpen() {
    this.checkboxsts = true
    console.log(this.checkboxsts);

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


  deviceConnected() {
    this.bluetoothSerial.subscribeRawData().subscribe((dt) => {
      this.bluetoothSerial.read().then((dd) => {
        this.onDataReceive(dd);
        this.cdr.detectChanges(); 
      });
    });
  }

  showWeight:any;
  //----------- weighing scale recived data ---------//
  onDataReceive(val) {
    var data = JSON.stringify(val)
    this.recivedWeightValue = Math.round(val  * 100) / 100;

    if(this.recivedWeightValue == this.recivedWeightValue){
      setTimeout(() => {
        this.showWeight = this.recivedWeightValue
      }, 5000)
      
    }

    this.cdr.detectChanges(); // or here
  }

  logout() {
    localStorage.clear()    
    this.router.navigate(['/loginpage'])
  }

}
