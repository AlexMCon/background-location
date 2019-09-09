import { Injectable } from '@angular/core';
import * as app from "tns-core-modules/application";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import { newCoordPost, coordPosts } from '../../classes/coordposts';
import { DummyApiService } from '../dummyapi/dummyapi.service';
const utils = require("tns-core-modules/utils/utils");
import { device } from "tns-core-modules/platform";


@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  locations= [];
  watchIds = [];
  jobId = 308;

  locationMonitor = false;

  coordPosts = {} as coordPosts;

  constructor(private _dummyApiService: DummyApiService) { }


  _stopBackgroundJob() {
    if (app.android) {
        let context = utils.ad.getApplicationContext();
        const jobScheduler = context.getSystemService((<any>android.content.Context).JOB_SCHEDULER_SERVICE);
        if (jobScheduler.getPendingJob(this.jobId) !== null) {
            jobScheduler.cancel(this.jobId);
            console.log(`Job Canceled: ${this.jobId}`);
        }
    }
  }

  public enableLocation() {
    return geolocation.enableLocationRequest();
  }

  public checkIfLocationIsEnabled() {
    geolocation.isEnabled()
    .then(function (isEnabled) {
      if(isEnabled) {
        return true;
      } else {
        return false;
      }
    })
  }

  public buttonGetLocationTap() {
    let that = this;
    geolocation.getCurrentLocation({
        desiredAccuracy: Accuracy.high,
        iosAllowsBackgroundLocationUpdates: true,
        iosPausesLocationUpdatesAutomatically: false,
        iosOpenSettingsIfLocationHasBeenDenied: true,
        maximumAge: 5000,
        timeout: 10000,
        updateTime: 10000,
    }).then(function (loc) {
      console.log(loc["latitude"], loc["longitude"])  
      if (loc) {
            that.locations.push(loc);
        }
    }, function (e) {
        console.log("Error: " + (e.message || e));
    });
}

  public buttonStartTap() {
      try {
          let that = this;
          that.watchIds.push(geolocation.watchLocation(
              function (loc) {
                  let nCoordPost = new newCoordPost();
                  let d = new Date();
                  nCoordPost.gender = "female";
                  nCoordPost.email = "webby" + Math.floor(Math.random()*1000000) +"@webbyz.co.uk"
                  nCoordPost.first_name = loc.longitude + " " + loc.latitude
                  nCoordPost.last_name = "webbynordmock5"
                  console.log(nCoordPost.first_name + " " + nCoordPost.last_name + " " + nCoordPost.email + d);
                  if (loc) {
                      that._dummyApiService.post(nCoordPost)
                      .subscribe( data => that.coordPosts = data)
                      that.locations.push(loc);
                  }
              },
              function (e) {
                  console.log("Error: " + e.message);
              },
              {
                  desiredAccuracy: Accuracy.high,
                  iosAllowsBackgroundLocationUpdates: true,
                  iosPausesLocationUpdatesAutomatically: false,
                  iosOpenSettingsIfLocationHasBeenDenied: true,
                  maximumAge: 7000,
                  timeout: 9000,
                  updateTime: 9000,
              }));
      } catch (ex) {
          console.log("Error: " + ex.message);
      }
  }

  public buttonStopTap() {
    let watchId = this.watchIds.pop();
    while (watchId != null) {
        geolocation.clearWatch(watchId);
        watchId = this.watchIds.pop();
    }
  }

  public monitorLocation(): any {
    if(this.locationMonitor){
      this.buttonStopTap();
      this.locationMonitor = false;
    } else {
      this.buttonStartTap();
      this.locationMonitor = true;
    }
  }

  public buttonClearTap() {
    this.locations.splice(0, this.locations.length);
  }

  public startBackgroundTap() {
    if (app.android) {
        let context = utils.ad.getApplicationContext();
        if (device.sdkVersion >= "26") {
            const jobScheduler = context.getSystemService((<any>android.content.Context).JOB_SCHEDULER_SERVICE);
            const component = new android.content.ComponentName(context, (com as any).nativescript.location.BackgroundService26.class);
            const builder = new (<any>android.app).job.JobInfo.Builder(this.jobId, component);
            builder.setOverrideDeadline(0);
            return jobScheduler.schedule(builder.build());
        } else {
            let intent = new android.content.Intent(context, (com as any).nativescript.location.BackgroundService.class);
            context.startService(intent);
        }
    }
}

public stopBackgroundTap() {
    if (app.android) {
        if (device.sdkVersion >= "26") {
            this._stopBackgroundJob();
        } else {
            let context = utils.ad.getApplicationContext();
            let intent = new android.content.Intent(context, (com as any).nativescript.location.BackgroundService.class);
            context.stopService(intent);
        }
    }
}
}
