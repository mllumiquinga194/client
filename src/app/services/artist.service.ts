import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";//Libreria para mapear objetos
import { Observable } from 'rxjs'; //para recoger las respuestas cuando hacemos una peticion ajax al servidor
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable() //para permitir que podamos inyectar este servicio en otra clase
export class ArtistService {
    public url: string; //aqui guardaremos la url de nuestra apiRest
    // al cargar este servicio hay que asignarle un valor a la url, para eso usamos el constructor con un atributo privado. para poder usar el servicio http tenemos que inyectar esa dependencia. de esta forma  ya podemos usar el obj http y todos sus metodos

    constructor(private _http: Http) {
        this.url = GLOBAL.url; //lo que configure en el archivo global.ts
    }

    getArtists(token, page){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'artists/'+page, options).pipe(map(res => res.json()));
    }

    getArtist(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'artist/'+id, options).pipe(map(res => res.json()));
    }

    addArtist(token, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        return this._http.post(this.url+'artist', params, {headers: headers}).pipe(map(res => res.json()));
    }
    editArtist(token, id: string, artist: Artist){
        let params = JSON.stringify(artist);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        return this._http.put(this.url+'artists/'+id, params, {headers: headers}).pipe(map(res => res.json()));
    }

    deleteArtist(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url+'artists/'+id, options).pipe(map(res => res.json()));
    }



}