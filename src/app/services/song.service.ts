import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";//Libreria para mapear objetos
import { Observable } from 'rxjs'; //para recoger las respuestas cuando hacemos una peticion ajax al servidor
import { GLOBAL } from './global';
import { Song } from '../models/song';


@Injectable() //para permitir que podamos inyectar este servicio en otra clase
export class SongService {
    public url: string; //aqui guardaremos la url de nuestra apiRest
    // al cargar este servicio hay que asignarle un valor a la url, para eso usamos el constructor con un atributo privado. para poder usar el servicio http tenemos que inyectar esa dependencia. de esta forma  ya podemos usar el obj http y todos sus metodos

    constructor(private _http: Http) {
        this.url = GLOBAL.url; //lo que configure en el archivo global.ts
    }

    getSong(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'song/'+id, options).pipe(map(res => res.json()));
    }

    getSongs(token, albumId = null){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});

        if(albumId == null){
            return this._http.get(this.url+'songs', options).pipe(map(res => res.json()));
        }else{
            return this._http.get(this.url+'songs/'+albumId, options).pipe(map(res => res.json()));
        }
    }

    addSong(token, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.post(this.url+'song', params, options).pipe(map(res => res.json()));
    }

    editSong(token, id: string, song: Song){
        let params = JSON.stringify(song);
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.put(this.url+'song/'+id, params, options).pipe(map(res => res.json()));
    }

    deleteSong(token, id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url+'song/'+id, options).pipe(map(res => res.json()));
    }

    searchSongs(token, name: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({headers: headers});
        return this._http.get(this.url+'searchsongs/'+name, options).pipe(map(res => res.json()));
    }

}