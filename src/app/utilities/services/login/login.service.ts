import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = 'https://nrdstr-api.webby-soft.com/auth/login/mobile'
  constructor(
    private http: HttpClient
  ) { }

  login (obj) {
    console.log(obj);
    return this.http.post(this.url, obj);
  }
}
