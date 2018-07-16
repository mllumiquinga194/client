import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Song } from '../models/song';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';


@Component({
    selector: 'song-add',
    templateUrl: '../views/song-add.html',
    providers: [
        UserService,
        AlbumService,
        SongService
    ]
})

export class SongAddComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public album_id;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.titulo = 'Cargar Nueva Cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', 60, '', '');
        this.album = new Album('', '', 2017, '', '');
    }

    ngOnInit() {
        console.log('song-add.component.ts cargado');
        this.getAlbum();//para llamar al album y mostrar su nombre al momento de cargar una nueva cancion
    }

    getAlbum() {
        this._route.params.forEach((params: Params) => { //tomo el id del album que recibo por parametros, llamo al getalbum del servicio de album y tomo su titulo.
            this.album_id = params['album'];
            this._albumService.getAlbum(this.token, this.album_id).subscribe(
                response => {
                    if (!response.album) {
                    } else {
                        this.album = response.album;
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

    onSubmit() {

        // //para recibir todos los parametros que son enviados por url
        //como envio el id del album, lo recibo aqui y lo guardo en this.song.album
        this._route.params.forEach((params: Params) => {
            this.album_id = params['album'];
            this.song.album = this.album_id;

            this._songService.addSong(this.token, this.song).subscribe(
                response => {

                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'La cancion se ha creado correctamente!';
                        this.song = response.song;
                        this._router.navigate(['/editar-tema', response.song._id]);
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