import { Component, OnInit, AfterViewInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { getRootView } from "tns-core-modules/application";
import * as app from "tns-core-modules/application";


import { CameraService } from "../utilities/services/camera/camera.service";
//import { GeolocationService } from "../services/geolocation/geolocation.service";
import { GeolocationService } from "../utilities/services/geolocation2/geolocation.service";
import { DummyApiService } from "../utilities/services/dummyapi/dummyapi.service"
import { WorkerService } from "../utilities/services/worker/worker.service"

import * as background from "../utilities/services/background/background.service"

// import * as TSWorker from "nativescript-worker-loader!../utilities/Workers/typescript.worker";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {

    private tsWorker: Worker;
    public drawer: RadSideDrawer;
    public buttonText = "Start";

    public nCoordPost = {
        first_name: 'ciocan',
        last_name: 'cocan',
        gender: 'female',
        email: "webby" + Math.floor(Math.random()*1000000) +"@webbyz.co.uk",
    }

    locations = [];
    watchIds = [];
    jobId = 308;
    
    constructor(
        private cameraService : CameraService,
        public geolocationService: GeolocationService,
        public dummyApiService: DummyApiService,
        private workerService: WorkerService,
        //private geolocationService : GeolocationService,
    ) {}

    ngOnInit(): void {
        app.on(app.exitEvent, this.geolocationService._stopBackgroundJob);
    }


    ngAfterViewInit() {
        this.drawer = <RadSideDrawer>getRootView();
        this.drawer.gesturesEnabled = true;
        if(!this.geolocationService.checkIfLocationIsEnabled) {
            this.geolocationService.locationMonitor === false;
        }
        console.log(this.geolocationService.locationMonitor);
        if(this.geolocationService.locationMonitor === true){
            this.buttonText = "Stop";
        } else {
            this.buttonText = "Start";
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }


    _onTakePhoto(){
        this.cameraService.onRequestPermissions()
        .then(result => {
            console.log(result);
            this.cameraService.onTakePhoto();
        })
    }
    
    checkLoc(){
        this.geolocationService.buttonGetLocationTap()
    }

    checkLocationTracking(){
        if(this.buttonText === "Start") {
            return true;
        } else {
            return false;
        }
    }

    public _onGeolocationService(){
        this.geolocationService.enableLocation()
        .then(result => {
            setTimeout(this.geolocationService.startBackgroundTap(),3000)
            setTimeout(this.geolocationService.monitorLocation(),3000)
            
            if(this.geolocationService.locationMonitor === true){
                this.buttonText = "Stop";
            } else {
                this.buttonText = "Start";
            }

        })
    }


    /*
    public getPosts(){
        this.dummyApiService.getPostByParameter("webbynordmock")
        .subscribe(data => console.log(data));
      }
    */

}
