import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { newCoordPost } from '../../classes/coordposts';

@Injectable()
export class DummyApiService
{
    apiPostUrl = "https://gorest.co.in/public-api/users?access-token=ih1-TwN21bktFvB9sfkNaA8PSYIyh0PzPMha"
    apiGetUrl = "https://gorest.co.in/public-api/users/?last_name="

    constructor(private _http: HttpClient) { }

    post(newCoordPost:newCoordPost): Observable<any> {
        return this._http.post(this.apiPostUrl, newCoordPost);
    }

    getPostByParameter(last_name: string): Observable<any> {
      //let employee1 = new HttpParams().set('/z÷',"71294");
      return this._http.get(this.apiGetUrl + last_name + "&access-token=ih1-TwN21bktFvB9sfkNaA8PSYIyh0PzPMha")
    }

}