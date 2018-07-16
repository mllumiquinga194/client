import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service'; //ya lo tengo disponible
import { User } from './models/user'; //importamos el modelo de usuario
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params } from '@angular/router';

//para cargar nuestro servicio dentro de un componente, lo exportamos, lo inyectamos como providers y lo vcargamos en el constructor
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [//cargamos nuestro servicio para poder usarlo
    UserService
  ]

})

export class AppComponent implements OnInit {
  public title = 'MUSIFY'; //esto va para el app.component.thml
  public user: User;
  public user_register: User;
  public identity; //para comprobar los datos del usuario logeado, dentro de la propiedad identity va a ir todos los datos del usuario logeado, luego lo guardaremos en el localstorage para luego revisarlo.
  public token; //tambien estara en el localstorage
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {// funcion para ejecutar codigo al cargar el componente
    // ya al acceder a la aplicacion podemos tomar los valores que estan en el localstorage (asignados en onSubmit) pero estos valores hay que procesarlos por lo cual vamos a crear unos metodos en nuestro servicio UserService para ahorrarnos ese trabajpo cada vez que querramos recoger algo del localstorage
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.user);//que es el objeto que se esta modificando con el two way data binding

    //conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;//el usuario que se ha logeado
        this.identity = identity; //en this.identity vamos a guardar la informacion del usaurio logeado que luego se va a usar globalmente ya que este es el componente principal.

        if (!this.identity._id) {
          alert("El usuario no esta correctamente identificado");
        } else {
          //crear elemento en el localstorage para tener al usuario en sesion
          localStorage.setItem('identity', JSON.stringify(identity));
          //conseguir el token para enviarselo a cada peticion http.
          this._userService.signup(this.user, 'true').subscribe(
            response => {
              let token = response.token;//el usuario que se ha logeado
              this.token = token; //en this.identity vamos a guardar la informacion del usaurio logeado que luego se va a usar globalmente ya que este es el componente principal.

              if (this.token.length <= 0) {
                alert("El token no se ha generado");
              } else {

                //crear elemento en el localstorage para tener token disponible
                // el token no lo convertimos con JSON.stringify porque ya es un string
                localStorage.setItem('token', token);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
              }
            },
            error => {
              //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
              var errorMessage = <any>error;

              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            });
        }
      },
      error => {
        //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      });
  }
  // "logout()" la hacer click aca lo que haremos es llamar a una funcion que eliminar lo que hay en el localstorage
  public logout() {

    // para borrar por item
    localStorage.removeItem('identity');
    localStorage.removeItem('token');

    // para borrar todo
    localStorage.clear();

    // para salir de la aplicacion, y volver a mostrar los formularios cambiamos el valor del identity y del token ya que en el form estos estan siendo consultados para mostrar o no los form
    this.identity = null;
    this.token = null;

    //hacer una redireccion para que cuando me deslogee, me lleve a la pag principal
    this._router.navigate(['/']);
  }

  public onSubmitRegister() {
    console.log(this.user_register);//que es el objeto que se esta modificando con el two way data binding

    this._userService.register(this.user_register).subscribe(Response => {
      
      let user = Response.user;
      this.user_register = user;

      if (!user._id) {
        this.alertRegister = 'Error al registrarse';
      } else {
        this.alertRegister = 'El registro se ha realizado correctamente, identificate con ' + this.user_register.email;
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', ''); // para poder volve a crear otro usuario y no tner basura
      }
    },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          
          this.alertRegister = body.message;

          console.log(body.err);
        }
      });

  }

}
