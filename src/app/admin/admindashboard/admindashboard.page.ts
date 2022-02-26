import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../shared/http.service';
import { Router } from '@angular/router'
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.page.html',
  styleUrls: ['./admindashboard.page.scss'],
})
export class AdmindashboardPage implements OnInit {

  constructor(public datepipe: DatePipe, private router: Router, private http: HttpService, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.myDate = new Date();
      this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
      this.fromdate = this.myDate;
      this.todate = this.myDate
      this.currentDateTime = this.datepipe.transform((new Date), 'yyyy-MM-dd hh:mm:ss');
      this.user = localStorage.getItem("Fishery-username",)
      this.locLoginType = localStorage.getItem("logintype",)
      this.totalAmount()
      this.totalWeight()
      this.marketTableRecords()
      this.merchantTableRecords()
      this.stockTableRecords()
    });


  }

  ngOnInit() {
  }

  myDate: any
  fromdate: any;
  todate: any;
  currentDateTime: any;
  user: any;
  currentDate = new Date();
  locLoginType: any;
  locPermission: any;
  totalweight: any
  totalCost: any;
  tableRecodrs: any = []
  totalQuantity: any;
  locFromDate: any;
  locToDate: any;
  stockTableEmpty: any = true;
  marketTableEmpty: any = true;
  merchantTableEmpty: any = true;
  stockTableRec: any = []
  marketTableRec: any = []
  merchantTableRec: any = []
  centerStockRecords: any = [];
  localsaleStockRecords: any = [];

  dosomething(event) {
    setTimeout(() => {
      event.target.complete();

    }, 1500);
  }

  userCreationPage() {
    this.router.navigate(['/admin-usercreation'])
  }

  //------------ navigate to weighter report page -------------//
  weighterReportPage() {
    this.router.navigate(['/weighter-report'], { queryParams: { fromdate: this.fromdate, todate: this.todate } })
    localStorage.setItem("fromDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)

  }

  //------------ navigate to biller report page -------------//
  billerReportPage() {
    this.router.navigate(['/biller-report'])
  }

  //------------- total weight ----------------//
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

  //------------------ total amount ----------------//
  totalAmount() {
    this.http.get('/bill_total_amount',).subscribe((response: any) => {
      this.totalCost = response.records.total_amount;
      console.log(response);
      if (response.records.total_amount == null) {
        this.totalCost = 0;
      }

    }, (error: any) => {
      console.log(error);
    }
    );
  }


  backToPrivios() {
    //------------logintype checking -------------//
    if (this.locLoginType == "ROLE_ADMIN") {
      this.router.navigate(['/admin-dashboard'])
    }

    if (this.locLoginType == "ROLE_WSHO") {

      //------------permission checking -------------//
      if (this.locPermission == "AUTO") {
        this.router.navigate(['/center-weight-auto-record'])
      }
      if (this.locPermission == "MANUAL") {
        this.router.navigate(['/center-weight-manual-record'])
      }

    }
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
      this.stockTableEmpty = true

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
    localStorage.clear()
    this.router.navigate(['/loginpage'])
  }

}
