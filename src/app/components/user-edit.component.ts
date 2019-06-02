import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { promise } from 'protractor';

// para indicar los metadatos que tendra este coponente y sus caracteristicas
@Component({
    selector: 'user-edit',//el componente se va a cargar en la etiqueta 'user-edit', para eso usamos el selector
    templateUrl: '../views/user-edit.html',//tambien se va a cargar una plantilla donde se va a poner el html de este componente
    providers: [ //para cargar servicios
        UserService
    ]
})

export class UserEditComponent implements OnInit {

    public titulo: string;
    public user: User;
    public users;
    public identity;
    public token;
    public alertMessage;
    public url: string;

    constructor(
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _router: Router
    ) {
        this.titulo = 'Actualizar mis datos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity; //para que al momento de actualizar, en el formulario ya me aparezcan los datos del usuario logeado.
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        this.getUsers();
    }

    //ahora para que me muestre los datos en formulario de editar usuario, llamo a esta funcion this.getUsers(); y en ella recibo el ID del usuario que quiero editar. con el identity puedo mantener la informacion del usuario que esta logeado y no perderla.
    getUsers() {
        this._route.params.forEach((params: Params) => { //tomo el id del album que recibo por parametros, llamo al getalbum sel servicio de album y tomo su titulo.
            let user_id = params['id'];
            this._userService.getUsers(user_id).subscribe(
                response => {

                    if (!response.users) {
                        this._router.navigate(['/']);
                    } else {
                        this.user = response.users[0];
                    }
                },
                error => {
                    //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                        this.alertMessage = body.message;

                        console.log(error);
                    }
                });
        });
    }

    onSubmit() {

        //si entro directamente a MIS DATOS, voy a actualizar el usuario que esta logeado pero si entro a la lista de usuario y elijo EDITAR, podre editar el usuario que haya elegido, esta opcion es solamente para administradores. en this.user tengo la informacion del usuario a editar.
        this._userService.updateUser(this.user).subscribe(
            response => {

                if (!response.user) {
                    this.alertMessage = 'El usuario no se ha actualizado';
                } else {
                    //this.user = response.user;
                    //si en este punto tengo response.user es porque la edicion se dio correctamente.

                    //para actualizar el localStorage yo primero consulto si el ID del usuario logeado es igual al ID del usuario que estoy editando. si es igual, actualizo el localStorage, si no es igual, no vale la pena actualizar el localStorage.
                    //esta condicion aplica tambien para poder cambiar el nombre en la vista
                    if (this.user._id == this.identity._id) {
                        localStorage.setItem('identity', JSON.stringify(this.user));
                        document.getElementById("identity_user").innerHTML = this.user.name;
                    }

                    if (!this.filesToUpload) {
                        //redireccion
                    } else {
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload)
                            .then((result: any) => {
                                this.user.image = result.image;

                                //solo actualizo el localStorage si los ID son iguales. esta actualizacion es para la imagen.
                                if (this.user._id == this.identity._id) {
                                    localStorage.setItem('identity', JSON.stringify(this.user));
                                }

                                //en image_path guardo la ubicacion de donde se encuentra la imagen del usuario. utilizo this.user.image porque yo se que asi se llama, por eso se lo contateno
                                let image_path = this.url + 'get-image-user/' + this.user.image
                                // cambio el atributo de la etiqueta src de esta forma y le mando la url guardada en image_path. identifico donde esta esa imagen por el id que tiene su etiqueta

                                //si llego a este punto es porque tambien cambie la imagen, la cual hago la misma consulta si quiero actualizar la magen que aparece en la vista. en dado caso que los ID sean diferentes es porque estoy editando un usuario que no es el logeado. por lo cual no cambio la imagen en la vista
                                if (this.user._id == this.identity._id) {
                                    document.getElementById("image-logged").setAttribute('src', image_path);
                                }

                            });
                    }

                    this.alertMessage = 'datos actualizados correctamente';
                }
            },
            error => {
                //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    var body = JSON.parse(error._body);
                    this.alertMessage = body.message;

                    console.log(error);
                }
            });
    }

    public filesToUpload: Array<File>;//arreglo de objetos de tipo file
    //fileInput: any en el cual vamos a recibir la informacion de los ficheros target a subir
    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;//recoge los archivos que se han seleccionado en el input para posteriormente subirlos

    }
    //para hacer la peticion ajax para subir ficheros convencionales
    makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        var token = this.token;

        //para lanzar el codigo de la subida
        return new Promise(function (resolve, reject) {

            var formData: any = new FormData();//para simular el comportamiento de un formualrio normal
            var xhr = new XMLHttpRequest(); //para hacer las peticiones ajax de JS tipica

            //recorrer los ficheros que recibamos por este array files: Array<File> para añadirlo al FomrData para luego suburlo
            for (var i = 0; i < files.length; i++) {
                formData.append('image', files[i], files[i].name);
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