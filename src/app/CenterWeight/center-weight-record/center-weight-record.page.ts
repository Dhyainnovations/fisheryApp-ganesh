import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/http.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Network } from '@awesome-cordova-plugins/network/ngx';
@Component({
  selector: 'app-center-weight-record',
  templateUrl: './center-weight-record.page.html',
  styleUrls: ['./center-weight-record.page.scss'],
})
export class CenterWeightRecordPage implements OnInit {

  constructor(private network: Network, public datepipe: DatePipe, public navCtrl: NavController, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.Localpermission = localStorage.getItem("permission",)
      this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
      this.totalWeight()
      this.locationBasedWeightRecords()
      this.records()
      this.marketTableRecords()
      this.merchantTableRecords()
      this.stockTableRecords()
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

    this.myDate = new Date();

    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
    this.fromdate = this.myDate;
    this.todate = this.myDate
  }




  ngOnInit() {
    this.locationBasedWeightRecords()
    this.user = localStorage.getItem("Fishery-username",)
    this.bluetoothSts = localStorage.getItem("bluetoothStatus",)

  }




  myDate: any;
  Localpermission: any;
  user: any;
  bluetoothSts: any;
  currentDateTime: any
  totalweight: any = '';
  tableRecodrs: any = []
  cardRecords: any = []

  isVisible: any = false
  lastEntryisVisible: any = false

  disableSts: any = false;
  checkoffline: any;
  checkonline: any;
  buttonDisabled: boolean;
  onlineAlart: any = true;
  offlineAlart: any = false

  fromdate: any;
  todate: any;

  fromDate(val) {
    console.log(val);
    this.fromdate = val

  }

  toDate(val) {
    console.log(val);
    this.todate = val
  }

  dateBasedRecord() {
    this.router.navigate(['/weighter-report'], { queryParams: { fromdate: this.fromdate, todate: this.todate } })
    localStorage.setItem("fromDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)

  }

  dosomething(event) {
    setTimeout(() => {
      event.target.complete();
      this.totalWeight()
    }, 1500);
  }



  totalWeight() {
    this.http.get('/list_total_manual_weight',).subscribe((response: any) => {
      this.totalweight = response.records.total_weight;

      if (response.records.total_weight == null) {
        this.totalweight = 0;
      }

    }, (error: any) => {
      console.log(error);
    }
    );
  }


  locationBasedWeightRecords() {
    this.http.get('/location_manual_weight',).subscribe((response: any) => {
      this.tableRecodrs = response.records;
      console.log(response);


    }, (error: any) => {
      console.log(error);
    }
    );
  }


  records() {
    this.http.get('/list_manual_weight',).subscribe((response: any) => {
      this.cardRecords = response.records;
      if (this.cardRecords == "No manual weight found.") {
        this.cardRecords = [];
        this.isVisible = true
        this.lastEntryisVisible = false
      } else {

        this.isVisible = false
        this.lastEntryisVisible = true
      }
    }, (error: any) => {
      console.log(error);
      this.cardRecords = [];
      this.isVisible = true
      this.lastEntryisVisible = false

    }
    );
  }


  //--------- navigation & LoginPermission checking function  ------------//
  navigateToNextPage() {

    if (this.Localpermission == "MANUAL") {
      this.router.navigate(['/centerweight-manual-weighter'])
    }
    if (this.Localpermission == "AUTO") {

      //-------- bluetooth connection status checking -----------//

      if (this.bluetoothSts == true) {
        this.router.navigate(['/centerweight-auto-weighter'])
      }
      if (this.bluetoothSts == null || this.bluetoothSts == false) {
        this.router.navigate(['/centerweight-auto-dashboard'])
      }

    }

  }


  delete(id) {
    console.log(id);

    const data = {
      boxid: id,
      isDeleted: "1"
    }

    this.http.post('/delete_manual_weight', data).subscribe((response: any) => {
      this.tableRecodrs = response.records;
      this.locationBasedWeightRecords()
      console.log(response);
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
          title: 'Deleted successfully.'
        })

        this.records()
        this.totalWeight()
        this.marketTableRecords()
        this.merchantTableRecords()

      } else {
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
          icon: 'error',
          title: 'Something went Wrong.'
        })
      }

    }, (error: any) => {
      console.log(error);

    }
    );
  }


  stockTableRec: any = []
  stockType: any = '';
  stockLocation: any = '';
  stockCategory: any = '';
  stockQuality: any = '';
  stockQuantity: any = '';
  stockTableRecords() {
    this.http.get('/list_table_stock',).subscribe((response: any) => {
      this.stockTableRec = response;
      if (this.stockTableRec == "No manual weight found.") {
        this.stockTableRec = [];

      } else {
        for (var i = 0; i < response.length; i++) {

          this.stockType = response[i].records[i].type;
          this.stockLocation = response[i].records[i].location;
          this.stockCategory = response[i].records[i].category;
          this.stockQuality = response[i].records[i].quality;
          this.stockQuantity = response[i].records[i].quantity;

          console.log(response[i].records[i].type);
          console.log(this.stockLocation);


        }

      }
    }, (error: any) => {
      console.log(error);
      this.stockTableRec = [];


    }
    );
  }

  marketTableRec: any = []
  marketTableRecords() {
    this.http.get('/list_table_market',).subscribe((response: any) => {
      this.marketTableRec = response.records;
      if (this.marketTableRec == "No manual weight found.") {
        this.marketTableRec = [];

      } else {


      }
    }, (error: any) => {
      console.log(error);
      this.marketTableRec = [];


    }
    );
  }

  merchantTableRec: any = []
  merchantTableRecords() {
    this.http.get('/list_table_merchant',).subscribe((response: any) => {
      this.merchantTableRec = response.records;
      if (this.merchantTableRec == "No manual weight found.") {
        this.merchantTableRec = [];

      } else {


      }
    }, (error: any) => {
      console.log(error);
      this.merchantTableRec = [];


    }
    );
  }


  logout() {
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }

}