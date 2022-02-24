import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../../shared/http.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-center-manual-weighter',
  templateUrl: './center-manual-weighter.page.html',
  styleUrls: ['./center-manual-weighter.page.scss'],
})
export class CenterManualWeighterPage implements OnInit {
  constructor(public datepipe: DatePipe, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.getCategoryList()
      this.getTypeList()
      this.getLocationList()
      this.records();

      this.activeItem = ""
      this.myDate = new Date();
      this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
    });



  }

  activeItem: any;
  myDate: any;
  user: any;
  tdyDate: any;
  today = new Date().toLocaleDateString()
  hr: any;
  updateTime: any;
  currentDateTime: any;
  setpushdata: any = [];
  category: any;
  type: any;
  place: any;
  location: any;
  weight: any;
  fishQuality: any;
  categorylist: any = []
  locationlist: any = []
  typelist: any = []
  tableRecodrs: any = []
  buttonDisabled: boolean;


  dateTime() {
    this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
  }

  ngOnInit() {

    this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
    this.user = localStorage.getItem("Fishery-username",)

  }

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

  //----------------- Api call ------------//
  onlineApiCal() {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    this.hr = hours + 12;
    this.updateTime = this.myDate + ' ' + hours + ":" + minutes + ":" + seconds

    const data = {
      quality: this.fishQuality,
      type: this.type,
      category: this.category,
      place: this.place,
      location: this.location,
      quantity: this.weight,
      isDeleted: "0",
      boxname: "box",
      updatedAt: this.updateTime
    }


    this.setpushdata.push(data);
    console.log(this.setpushdata);
    var setdata = (JSON.stringify(this.setpushdata));
    localStorage.setItem('added-items', setdata);

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
      //console.log(listTypeBasedOnCategory);
      if (this.category == listTypeBasedOnCategory.Categorypush) {

        this.StoreTypeData.push(listTypeBasedOnCategory.Typepush);
        console.log(this.StoreTypeData);

      }

    }
    console.log(this.StoreTypeData);


  }

  delete(id) {
    console.log(id);

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
    //console.log(DisplayCategory);
  }

  getTypeList() {
    var GetType = localStorage.getItem('SetType');
    this.typelist = (JSON.parse((GetType)));

  }

  getLocationList() {
    var GetLocation = localStorage.getItem('SetLocation');
    this.locationlist = (JSON.parse((GetLocation)));
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

  logout() {
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }




}