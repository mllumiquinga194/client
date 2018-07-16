import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";//Libreria para mapear objetos
import { Observable } from 'rxjs'; //para recoger las respuestas cuando hacemos una peticion ajax al servidor
import { GLOBAL } from './global';

@Injectable() //para permitir que podamos inyectar este servicio en otra clase
export class UserService {
    public identity;
    public token;
    public url: string; //aqui guardaremos la url de nuestra apiRest
    // al cargar este servicio hay que asignarle un valor a la url, para eso usamos el constructor con un atributo privado. para poder usar el servicio http tenemos que inyectar esa dependencia. de esta forma  ya podemos usar el obj http y todos sus metodos

    constructor(private _http: Http) {
        this.url = GLOBAL.url; //lo que configure en el archivo global.ts
    }
    //esta funcion recibira el usuario que va a ser logeado y un parametro alternativo que se va a llamar gethash la cual no es obligatorio. si no le pasamos este valor, se devolvera el objeto del usuario que se ha logeado pero si se recibe el hash, entonces se devolvera el token de jwt
    signup(user_to_login, gethash = null) {

        //esto es en dado caso que traiga el gethash
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }

        let json = JSON.stringify(user_to_login); //convertimos a un string el objeto que vamos a recibir.
        let params = json;

        //le pasamos el Content-Type de tipo application/json ya que estamos trabajando con mean stack, o sea, todo javascript, si estuvieramos trabajando con otro backend le podriamos pasar los datos de otra forma, ejemplo 3wencoded (no escuche bien jeje)
        let headers = new Headers({ 'Content-Type': 'application/json' });

        //this.url+'login': hacemos una consulta al metdo login que tenemos en nuestra api, le pasamos los parametros y los headers. luego mapeamos y en la funcion de callback codificamos a json
        return this._http.post(this.url + 'login', params, { headers: headers }).pipe(map(res => res.json()));
    }

    getUsers(id: string) {
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });
        let options = new RequestOptions({ headers: headers });
        if(id == null){
            return this._http.get(this.url + 'users/', options).pipe(map(res => res.json()));
        }else{
            return this._http.get(this.url + 'users/' + id, options).pipe(map(res => res.json()));
        }
    }

    comparePass(token, password_old, id: string) {
        let json = JSON.stringify(password_old);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': token });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.url + 'comparePass/' + id, params, options).pipe(map(res => res.json()));
    }

    updatePass(user_to_update) {
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });
        return this._http.post(this.url + 'pass/' + user_to_update._id, params, { headers: headers }).pipe(map(res => res.json()));
    }

    register(user_to_register) {
        let json = JSON.stringify(user_to_register);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'register', params, { headers: headers }).pipe(map(res => res.json()));
    }

    updateUser(user_to_update) {
        let json = JSON.stringify(user_to_update);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': this.getToken() });
        return this._http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers }).pipe(map(res => res.json()));
    }

    deleteUser(id: string){
        let headers = new Headers({'Content-Type': 'application/json', 'Authorization': this.getToken() });
        let options = new RequestOptions({headers: headers});
        return this._http.delete(this.url+'user/'+id, options).pipe(map(res => res.json()));
    }

    // vamos a convertir un objeto que tenemos guardado en el localstorage a un objeto de javascript
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    getToken() {
        //el token no lo convertimos porque ya es un string
        let token = localStorage.getItem('token');

        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }

        return this.token;
    }

}