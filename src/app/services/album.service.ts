import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";//Libreria para mapear objetos
import { Observable } from 'rxjs'; //para recoger las respuestas cuando hacemos una peticion ajax al servidor
import { GLOBAL } from './global';
import { Album } from '../models/album';


@Injectable() //para permitir que podamos inyectar este servicio en otra clase
export class AlbumService {
    public url: string; //aqui guardaremos la url de nuestra apiRest
    // al cargar este servicio hay que asignarle un valor a la url, para eso usamos el constructor con un atributo privado. para poder usar el servicio http tenemos que inyectar esa dependencia. de esta forma  ya podemos usar el obj http y todos sus metodos

    constructor(private _http: Http) {
        this.url = GLOBAL.url; //lo que configure en el archivo global.ts
    }

    getAlbums(token, artistID = null){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        if(artistID == null){
            return this._http.get(this.url+'albums/', options).pipe(map(res => res.json()));
        }else{
            return this._http.get(this.url+'albums/'+artistID, options).pipe(map(res => res.json()));
        }
    }

    getAlbum(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'album/'+id, options).pipe(map(res => res.json()));
    }

    addAlbum(token, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.post(this.url+'album', params, options).pipe(map(res => res.json()));
    }

    editAlbum(token, id: string, album: Album){
        let params = JSON.stringify(album);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.put(this.url+'album/'+id, params, options).pipe(map(res => res.json()));
    }

    deleteAlbum(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url+'album/'+id, options).pipe(map(res => res.json()));
    }

    



}