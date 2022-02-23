import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../shared/http.service';
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-weighter-report',
  templateUrl: './weighter-report.page.html',
  styleUrls: ['./weighter-report.page.scss'],
})
export class WeighterReportPage implements OnInit {

  constructor( public datepipe: DatePipe, public navCtrl: NavController, private http: HttpService, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.records()
      this.LoadReadData();
      this.tableRecodrs = []
    });

  }

  ngOnInit() {
  }

  locLoginType = localStorage.getItem("logintype",)
  locFromDate = localStorage.getItem("fromDate",)
  locToDate = localStorage.getItem("toDate",)

  todayDate: any;
  fromdate: any;
  todate: any;
  disableSts: any = false;
  checkoffline: any;
  checkonline: any;
  
  tableRecodrs: any = []
  totalQuantity: any;

  dosomething(event) {
    setTimeout(() => {
      event.target.complete();

    }, 1000);
  }


  backToPrivios() {
    //------------logintype checking -------------//
    if (this.locLoginType == "ROLE_ADMIN") {
      this.router.navigate(['/admindashboard'])
    }

    if (this.locLoginType == "ROLE_WSHO") {
      this.router.navigate(['/center-weight-record'])
    }
  }

  //------------Query params get data -------------//
  LoadReadData() {
    this.route.queryParams.subscribe(params => {
      this.fromdate = params.fromdate;
      this.todate = params.todate;

    }
    );
  }


  //------------report records -------------//
  records() {
    const data = {
      from_date: this.locFromDate,
      to_date: this.locToDate
    }

    this.http.post('/list_center_date_manual_weight', data).subscribe((response: any) => {
      this.totalQuantity = response.total_quantity
      this.tableRecodrs = response.records;

    }, (error: any) => {
      console.log(error);
    }
    );
  }


}