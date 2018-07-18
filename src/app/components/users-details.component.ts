import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';

// para indicar los metadatos que tendra este coponente y sus caracteristicas
@Component({
    selector: 'users-details',//el componente se va a cargar en la etiqueta 'user-edit', para eso usamos el selector
    templateUrl: '../views/users-details.html',//tambien se va a cargar una plantilla donde se va a poner el html de este componente
    providers: [ //para cargar servicios
        UserService
    ]
})

export class UsersDetailsComponent implements OnInit {

    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public url: string;
    public users;
    public confirmado;

    constructor(

        private _userService: UserService,
        private _router: Router
    ) {
        this.titulo = 'Listado de Usuarios';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.users;
        this.url = GLOBAL.url;
    }

    ngOnInit() {

        console.log('Users-details.component.ts cargado');
        this.getUsers();
    }

    getUsers(){

        this._userService.getUsers(null).subscribe(
            response => {

                if (!response.users) {
                    this._router.navigate(['/']);
                } else {
                    this.users = response.users;
                    console.log(this.users);
                    
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

    onSubmit() {

        
    }

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelUser(){
        this.confirmado = null;
    }

    onDeleteUser(id){
        this._userService.deleteUser(id).subscribe(
            response => {
                if(!response.user){
                    alert('Error en el servidor');
                }
                console.log('Borrado este Id: ',response.user._id);
                
                this.getUsers();//para actualizar la lista de usuarios
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
        )
    }

}