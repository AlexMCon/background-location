import { Injectable, ɵivyEnabled } from "@angular/core";
import { Accuracy } from "tns-core-modules/ui/enums";
import { Location, getCurrentLocation, isEnabled, distance, enableLocationRequest, watchLocation, clearWatch } from "nativescript-geolocation";
import { timestamp } from "rxjs/operators";
import { borderTopRightRadiusProperty } from "tns-core-modules/ui/page/page";

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  public isMonitoring = false;
  public options;
  public listener;
  public monitorLongitude: string = "0";
  public monitorLatitude: string = "0";
  public monitorAltitude: string = "0";
  public monitorDirection: string = "0";
  public monitorSpeed: string = "0";
  public location: object;
  public timeTracker;

    constructor () {
      this.options = {
        desiredAccuracy: Accuracy.high,
        updateDistance: 1,
        updateTime: 1000 * 3,
        minimumUpdateTime: 1000 * 2,
      };
    }

    monitor() {
      // >> location-monitoring
      if (this.isMonitoring) {
          clearWatch(this.listener);
          this.isMonitoring = false;
      } else {
          this.listener = watchLocation((loc: Location) => {
              if (loc) {
                  console.log(loc.longitude + " " + loc.latitude + " " + new Date().toISOString())
                  this.location = loc;
                  this.monitorLongitude = (loc.longitude).toFixed(4);
                  this.monitorLatitude = (loc.latitude).toFixed(4);
                  this.monitorAltitude = (loc.altitude).toFixed(2);
                  this.monitorDirection = (loc.direction).toFixed(2);
                  this.monitorSpeed = (loc.speed).toFixed(2);
                  this.timeTracker = new Date();
              }
          }, (e) => {
              console.log("Error: " + e.message);
          }, this.options);

          this.isMonitoring = true;
      }
      // << location-monitoring
    }

    onRequestPermissions() {
      return enableLocationRequest(true);
  }
}