import { Injectable } from '@angular/core';
import { Http} from '@angular/http';

@Injectable()

export class FileService {

    constructor( private http:Http ){}

    upload(files:Array<File>):Promise<Object> {

        let url = '';
        return new Promise((resolve,reject)=> {

            let formData = new FormData();
            var xhr = new XMLHttpRequest();

            for(let i = 0; i < files.length;i++){
                formData.append(`img${i}`,files[i],files[i].name)
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Access-Token',this.token());
            xhr.send(formData);
        });
    }

    private token():string{
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = currentUser._id;

        return token;
    }
}
