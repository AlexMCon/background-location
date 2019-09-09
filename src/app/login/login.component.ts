import { Component, OnInit, AfterViewInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { RouterExtensions } from "nativescript-angular/router";
import { SecureStorage } from "nativescript-secure-storage";
import { getRootView } from "tns-core-modules/application";
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { shortToast, errorToast, positionToast, chainedToast, cancelToast } from '../utilities/classes/toast';
import { loginInfo } from "../utilities/classes/login";

import { LoginService } from "../utilities/services/login/login.service";
import { GeolocationService } from "../utilities/services/geolocation2/geolocation.service"

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    Username: string;
    Password: string;
    
    errors = undefined;

    text: string;

    public drawer: RadSideDrawer;
    
    constructor(
        private routerExtensions: RouterExtensions,
        private loginService: LoginService,
        public geoService: GeolocationService,
        ) {}

    ngOnInit(): void {
        this.geoService.buttonStopTap();
        this.geoService.locationMonitor = false;
        console.log(this.geoService.locationMonitor);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.drawer = <RadSideDrawer>getRootView();
            this.drawer.gesturesEnabled = true;
        }, 250);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });
    }

    secureStorage = new SecureStorage();

    setSecureValue(value) {
        this.secureStorage.set({
            key: 'logintoken',
            value,
        }).then(success => {console.log(success)});
      }

    getSecureValue() {
        console.log(this.secureStorage.getSync({
            key: 'logintoken',
        }));
    }

    public removeSecureValue() {
        this.secureStorage.remove({
            key: 'logintoken',
        }).then(success => console.log("Successfully removed a value? " + success));
    }

    validateEntries(email/*, password*/) {
        let user = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/
        if(!user.test(String(email).toLowerCase())){
            errorToast('  Your credentials are incorrect.  ');
            return true;
        }
        /*
        if(!pass.test(String(email).toLowerCase())){
            errorToast('  Your credentials are incorrect.  ');
            return false;
        }
        */
    }

    sendLogin(){
        let login = new loginInfo();
        login.username = this.Username;
        login.password = this.Password;

        if(this.validateEntries(login.username/*, login.password*/)){
            return;
        };
    
        this.loginService.login(login)
        .subscribe( data => {
            this.onNavItemTap("/home");
            this.setSecureValue(data["jwt"]);
        }, error => {
            errorToast('  Your credentials are incorrect.  ');
        })
      }
    
    //
    cons (value){
        console.log(value);
    }

}
