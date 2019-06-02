import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Response } from '@angular/http';


@Component({
    selector: 'album-add',
    templateUrl: '../views/album-add.html',
    providers: [
        UserService,
        ArtistService,
        AlbumService
    ]
})

export class AlbumAddComponent implements OnInit {
    public titulo: string;
    public artist: Artist;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public artist_id;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService
    ) {
        this.titulo = 'Crear Nuevo Album';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.album = new Album('', '', 2017, '', '');
        this.artist = new Artist('', '', '');

    }

    ngOnInit() {
        //Llamar al metodo del api para sacar un artista en base a su id getArtist
        this.getArtist();

    }

    getArtist(){
        this._route.params.forEach((params: Params) => { //tomo el id del album que recibo por parametros, llamo al getalbum sel servicio de album y tomo su titulo.
            this.artist_id = params['artist'];
            this._artistService.getArtist(this.token, this.artist_id).subscribe(
                response => {
                    if (!response.artist) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.artist = response.artist;
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
            )
        });
    }

    onSubmit(){
        //para recibir todos los parametros que son enviados por url
        this._route.params.forEach((params: Params) => {
            this.artist_id = params['artist'];
            this.album.artist = this.artist_id;
            
            this._albumService.addAlbum(this.token, this.album).subscribe(
                response => {

                    if(!response.album){
                        this.alertMessage = 'Error en el servidor';
                    }else{
                        
                        this.alertMessage = 'El album se ha creado correctamente!';
                        this.album = response.album;
                        this._router.navigate(['/editar-album', response.album._id]);
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
            )
        });
        

        
    }

}