import { Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Rx';

@Injectable()

export class AuthService {
    constructor(
        private http:Http,
    ){}

    login(email:string, password:string) {

        let body = {
            email:email,
            password:password
        };
        let request = JSON.stringify(body);

        let headers = new Headers({
            'Content-Type':'application/json'
        });

        let options = new RequestOptions({ headers: headers});

        return this.http.post('http://kupi-oreh.ru:8085/user/auth', body, options)
            .map((response:Response) => {

                let data = response.json();

                if (data.session && data.session._id) {
                    // store user details and  token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(data.session));

                }
            })
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

    }
    logout(){
        localStorage.removeItem('currentUser');
    }

}
