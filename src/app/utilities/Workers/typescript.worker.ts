import "tns-core-modules/globals";
import * as geolocation from "nativescript-geolocation";
import { Accuracy } from "tns-core-modules/ui/enums";
import axios from "axios";


const watchIds = [];
class newCoordPost {
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
}

const context: Worker = self as any;

function enableLocation() {
    return geolocation.enableLocationRequest();
}

function buttonStartTap() {
    try {
        watchIds.push(geolocation.watchLocation(
            function (loc) {
                let nCoordPost = new newCoordPost();
                let d = new Date();
                nCoordPost.gender = "female";
                nCoordPost.email = "webby" + Math.floor(Math.random()*1000000) +"@webbyz.co.uk"
                nCoordPost.first_name = loc.longitude + " " + loc.latitude
                nCoordPost.last_name = "webbynordmock11"
                console.log(nCoordPost.first_name + " " + nCoordPost.last_name + " " + nCoordPost.email + d);
                if (loc) {
                    axios.post("https://gorest.co.in/public-api/users?access-token=ih1-TwN21bktFvB9sfkNaA8PSYIyh0PzPMha", nCoordPost)
                    .then (response => {return response;} )
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

context.onmessage = msg => {
        console.log(msg);

};

