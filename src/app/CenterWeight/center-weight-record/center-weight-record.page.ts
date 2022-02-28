import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../../shared/http.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';

@Component({
  selector: 'app-center-weight-record',
  templateUrl: './center-weight-record.page.html',
  styleUrls: ['./center-weight-record.page.scss'],
})
export class CenterWeightRecordPage implements OnInit {

  constructor(private bluetoothSerial: BluetoothSerial, public datepipe: DatePipe, public navCtrl: NavController, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.Localpermission = localStorage.getItem("permission",)
      this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
      this.totalWeight()
      this.locationBasedWeightRecords()
      this.records()
      this.marketTableRecords()
      this.merchantTableRecords()
      this.stockTableRecords()

    });

    this.myDate = new Date();
    this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
    this.fromdate = this.myDate;
    this.todate = this.myDate
  }

  ngOnInit() {
    this.locationBasedWeightRecords()
    this.user = localStorage.getItem("Fishery-username",)
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
  buttonDisabled: boolean;
  fromdate: any;
  todate: any;
  stockTableEmpty: any = true;
  marketTableEmpty: any = true;
  merchantTableEmpty: any = true;
  stockTableRec: any = []
  marketTableRec: any = []
  merchantTableRec: any = []
  centerStockRecords: any = [];
  localsaleStockRecords: any = [];
  fromDate(val) {
    this.fromdate = val

  }

  toDate(val) {
    this.todate = val
  }


  //--------------- navigate to weighter report page ------------//
  dateBasedRecord() {
    this.router.navigate(['/weighter-report'], { queryParams: { fromdate: this.fromdate, todate: this.todate } })
    localStorage.setItem("fromDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)

  }

  dosomething(event) {
    setTimeout(() => {
      event.target.complete();
      this.totalWeight()
    }, 1000);
  }


  //-------------------- totalWeight Api ------------------//
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

  //------------- location based table record ------------//
  locationBasedWeightRecords() {
    this.http.get('/location_manual_weight',).subscribe((response: any) => {
      this.tableRecodrs = response.records;

    }, (error: any) => {
      console.log(error);
    }
    );
  }

  //-------------- card records (last 2 entry) ------------//
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

      if (this.bluetoothSts == "connected") {
        this.router.navigate(['/centerweight-auto-weighter'])
      }
      if (this.bluetoothSts == null || this.bluetoothSts == "") {
        this.router.navigate(['/centerweight-auto-dashboard'])
      }

    }

  }

  //-------------------Delete Api -------------//
  delete(id) {
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

  //------------ stock table records --------------//
  stockTableRecords() {
    this.http.get('/list_table_stock',).subscribe((response: any) => {
      if (this.stockTableRec == "No manual weight found.") {
        this.stockTableRec = [];
        this.stockTableEmpty = true
      } else {
        this.stockTableEmpty = false
       this.centerStockRecords = response[0].center_records;
       this.localsaleStockRecords = response[1].localsale_records;
      }
    }, (error: any) => {
      console.log(error);
      this.stockTableRec = [];


    }
    );
  }

  //------------ market table records --------------//
  
  marketTableRecords() {
    this.http.get('/list_table_market',).subscribe((response: any) => {
      this.marketTableRec = response.records;
      if (this.marketTableRec == "No manual weight found.") {
        this.marketTableRec = [];
        this.marketTableEmpty = true
      } else {
        this.marketTableEmpty = false
      }
    }, (error: any) => {
      console.log(error);
      this.marketTableRec = [];
    }
    );
  }

  //------------ merchant table records --------------//
  
  merchantTableRecords() {
    this.http.get('/list_table_merchant',).subscribe((response: any) => {
      this.merchantTableRec = response.records;
      if (this.merchantTableRec == "No manual weight found.") {
        this.merchantTableRec = [];
        this.merchantTableEmpty = true
      } else {
        this.merchantTableEmpty = false
      }
    }, (error: any) => {
      console.log(error);
      this.merchantTableRec = [];
    }
    );
  }


  logout() {
    this.bluetoothSerial.disconnect();
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }

}