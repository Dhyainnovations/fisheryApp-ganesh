import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../weighter/./../../shared/http.service';
import { Router } from '@angular/router'
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-biller-report',
  templateUrl: './biller-report.page.html',
  styleUrls: ['./biller-report.page.scss'],
})
export class BillerReportPage implements OnInit {

  constructor(public datepipe: DatePipe, public navCtrl: NavController, private http: HttpService, private router: Router, private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.records()
      this.tableRecodrs = []
    });
  
    
  }

  ngOnInit() {

  }

  locLoginType = localStorage.getItem("logintype",)
  locPermission = localStorage.getItem("permission",)
  locFromDate = localStorage.getItem("fromDate",)
  locToDate = localStorage.getItem("toDate",)
  todayDate: any;
  fromdate: any;
  todate: any;
  tableRecodrs: any = []
  totalQuantity: any;
  isVisible: any = false;
  price: any;
  totalPrice: any = 0;


  dosomething(event) {
    setTimeout(() => {
      event.target.complete();

    }, 1500);
  }


  backToPrivios() {
    this.router.navigate(['/admindashboard'])
  }

  
  //--------------- table records -------------//
  records() {
    const data = {
      from_date: this.locFromDate,
      to_date: this.locToDate
    }

    this.http.post('/list_localsale_date_manual_bill', data).subscribe((response: any) => {
      console.log(response);
      this.totalQuantity = response.total_quantity;
      this.tableRecodrs = response.records;
      this.isVisible = false;
      for (var i = 0; i <= response.records.length; i++) {
        this.price = response.records[i].totalamount;
        this.totalPrice += parseInt(response.records[i].totalamount);
      }
    
    }, (error: any) => {
      console.log(error);
      this.totalQuantity = 0;
      this.isVisible = true;
    }
    );
  }


}

