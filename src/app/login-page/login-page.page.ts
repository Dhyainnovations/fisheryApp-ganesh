import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../shared/http.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
})
export class LoginPagePage implements OnInit {

  constructor( public datepipe: DatePipe, private platform: Platform, private router: Router, private activatedRoute: ActivatedRoute, private http: HttpService, route: ActivatedRoute,) {
    route.params.subscribe(val => {
      this.Locallogintype = localStorage.getItem("logintype",)
      this.Localpermission = localStorage.getItem("permission",)
      setTimeout(() => {
        if (this.Locallogintype) {
          this.checkToNavigate()
        }
        else if (this.Locallogintype == null) {
          this.router.navigate(['/loginpage'])
        }

      }, 2000)

      this.myDate = new Date();
      this.myDate = this.datepipe.transform(this.myDate, 'yyyy-MM-dd');
      this.fromdate = this.myDate;
      this.todate = this.myDate
    });

  }

  ngOnInit() {

  }

  fromdate: any;
  todate: any;
  myDate:any;
  username: any;
  password: any;
  orgid: any;
  userName: any;
  logintype: any;
  permission: any;
  LocalOrgid: any;
  LocaluserName: any;
  Locallogintype: any;
  Localpermission: any;
  backButtonSubscription: any;

  //---------------- login Api --------------//
  login() {

    localStorage.setItem("fromDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)

    const Data = {
      id: this.username,
      password: this.password
    }

    this.http.post('/login', Data).subscribe((response: any) => {
      console.log(response);

      if (response.success == "true") {

        this.orgid = response.orgid,
          this.username = response.id,
          this.logintype = response.loginType,
          this.permission = response.permission,

          console.log(this.orgid, this.logintype);


        localStorage.setItem("orgid", this.orgid)
        localStorage.setItem("Fishery-username", this.username)
        localStorage.setItem("logintype", this.logintype)
        localStorage.setItem("permission", this.permission)

        if (response.success == "true") {

          this.username = ""
          this.password = ""

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
            title: 'Signed in successfully'
          })


          this.LocalOrgid = (localStorage.getItem("orgid"));
          this.LocaluserName = (localStorage.getItem("Fishery-username"));
          this.Locallogintype = (localStorage.getItem("logintype"));
          this.Localpermission = (localStorage.getItem("permission"));

          console.log(this.Locallogintype);
          console.log(this.Localpermission);

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


          //----------- Set Category Based On Type Local Storage --------------//

          this.http.get('/list_type_manual').subscribe((response: any) => {
            var SetTypeBasedOnCategory = (JSON.stringify(response.records));
            localStorage.setItem('SetTypeBasedOnCategory', SetTypeBasedOnCategory);
            console.log(response);
          }, (error: any) => {
            console.log(error);
          }
          );


          //----------- Set Location To Local Storage --------------//

          //----------- centerLocation Local Storage --------------//
          this.http.get('/list_location',).subscribe((response: any) => {
            var SetLocation = (JSON.stringify(response.records));
            localStorage.setItem('SetLocation', SetLocation);
          }, (error: any) => {
            console.log(error);
          });

          //------localsale location ----//
          this.http.get('/list_localsale_place').subscribe((response: any) => {
            var SetLocalSaleLocations = (JSON.stringify(response.records));
            localStorage.setItem('localSaleLocation', SetLocalSaleLocations);
            console.log(response);
          }, (error: any) => {
            console.log(error);
          }
          );

          //------ market  location ----//
          this.http.get('/list_market').subscribe((response: any) => {
            var SetMarketLocations = (JSON.stringify(response.records));
            localStorage.setItem('marketLocation', SetMarketLocations);
            console.log(response);
          }, (error: any) => {
            console.log(error);
          }
          );

          //------ merchant location ----//
          this.http.get('/list_merchant').subscribe((response: any) => {
            var SetMerchantLocations = (JSON.stringify(response.records));
            localStorage.setItem('merchantLocation', SetMerchantLocations);
            console.log(response);
          }, (error: any) => {
            console.log(error);
          }
          );

          this.checkToNavigate();
        }


      } else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'error',
          title: 'Please enter a valid email (or) password'
        })
      }
    }, (error: any) => {
      console.log(error);
    }
    );


  }



  checkToNavigate() {
    //-------center login check----------//

    if (this.Locallogintype == "ROLE_WSHO") {
      this.router.navigate(['/center-weight-record'])
    }

    //-------admin login check----------//

    if (this.Locallogintype == "ROLE_ADMIN") {
      this.router.navigate(['/admindashboard'])
    }

  }

}