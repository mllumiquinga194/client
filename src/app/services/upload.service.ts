import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions } from '@angular/http';
import { map } from "rxjs/operators";//Libreria para mapear objetos
import { Observable } from 'rxjs'; //para recoger las respuestas cuando hacemos una peticion ajax al servidor
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable() //para permitir que podamos inyectar este servicio en otra clase
export class UploadService {
    public url: string; //aqui guardaremos la url de nuestra apiRest
    // al cargar este servicio hay que asignarle un valor a la url, para eso usamos el constructor con un atributo privado. para poder usar el servicio http tenemos que inyectar esa dependencia. de esta forma  ya podemos usar el obj http y todos sus metodos

    constructor(private _http: Http) {
        this.url = GLOBAL.url; //lo que configure en el archivo global.ts
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {

        //para lanzar el codigo de la subida
        return new Promise(function (resolve, reject) {

            var formData: any = new FormData();//para simular el comportamiento de un formualrio normal
            var xhr = new XMLHttpRequest(); //para hacer las peticiones ajax de JS tipica

            //recorrer los ficheros que recibamos por este array files: Array<File> para añadirlo al FomrData para luego subirlo
            for (var i = 0; i < files.length; i++) {
                formData.append(name, files[i], files[i].name);
            }
            //para comprobar si esta lista la peticion para realizarse
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {//usamos la funcion resolve para hacer un JSON parse de la response. o sea, de la respuesta que recibimos al enviar este archivo.
                    if (xhr.status == 200) {//solo si la peticion http nos devolviera un status 200
                        resolve(JSON.parse(xhr.response));//para que nos devuelva parseado la respuesta que nos ha enviado el metodo del api
                    } else {
                        reject(xhr.response)
                    }
                }
            }

            xhr.open('POST', url, true);//lanzar esa peticion
            xhr.setRequestHeader('Authorization', token);//le indicamos un headers de autorization pasandole un token de usuario logeado que contiene todos los datos del usuario que este identificado.
            xhr.send(formData);//por fin realizamos toda la peticion ajax.
        });
    }

}