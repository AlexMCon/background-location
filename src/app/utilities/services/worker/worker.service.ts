import { Injectable, RootRenderer } from "@angular/core";

// add if building with webpack
import * as TsWorker from "nativescript-worker-loader!../../Workers/typescript.worker";

@Injectable({
    providedIn: "root"
})
export class WorkerService {
    constructor() {
    }

    initTsWorker() {
        const worker = new TsWorker();
        return worker;
    } 

}