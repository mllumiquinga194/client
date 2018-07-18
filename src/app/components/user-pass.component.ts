import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';

// para indicar los metadatos que tendra este coponente y sus caracteristicas
@Component({
    selector: 'user-pass',//el componente se va a cargar en la etiqueta 'user-edit', para eso usamos el selector
    templateUrl: '../views/user-pass.html',//tambien se va a cargar una plantilla donde se va a poner el html de este componente
    providers: [ //para cargar servicios
        UserService
    ]
})

export class UserPassComponent implements OnInit {

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;
    public pass_actual;

    constructor(

        private _userService: UserService,
        private _router: Router
    ) {
        this.titulo = 'Actualizar Contraseña';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity; //para que al momento de actualizar, en el formulario ya me aparezcan los datos del usuario logeado.
        this.url = GLOBAL.url;
        this.pass_actual = {
            password: ''
        }
    }

    ngOnInit() {
        console.log('User-pass.component.ts cargado');
    }

    onSubmit() {

        //para cambiar la contraseña, primero consulto si la contraseña actual que escribi es la misma que esta en la base de datos para ese usuario,
        if (this.pass_actual == null) {
            this.alertMessage = 'Rellene todos los campos';
        } else {
            // console.log(this.pass_actual.password);

            // console.log(this.user.password);

            //aqui llamo al metodo de comparacion que esta en _userService
            this._userService.comparePass(this.token, this.pass_actual, this.identity._id).subscribe(
                response => {
                    if (!response.user) {
                        this.alertMessage = 'La contraseña no coincide';
                    } else {
                        // console.log('esto viene del servidor: ', response.user);
                        // console.log(this.user);

                        if (this.user.password == null) {
                            this.alertMessage = 'Rellene todos los campos';
                        } else {

                            //para actualizar la contraseña utilizo this.user ya que en el tengo asociado el campo contraseña nueva de la vista con el binding que me modifica user.password
                            //no uso response.user porque en esa respuesta la password ya esta encriptada ademas este password es la actual, o sea, la vieja que quiero cambiar!
                            //si la contraseña es igual, o sea, es la misma, entonces llamo al metodo que me actualiza la contraseña.
                            this._userService.updatePass(this.user).subscribe(
                                response => {

                                    if (!response.user) {
                                        this.alertMessage = 'El usuario no se ha actualizado';
                                    } else {

                                        this.alertMessage = 'Datos actualizados correctamente';
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
                            this._router.navigate(['mi-contrasena']);
                        }
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
                }
            );
        }

    }

}