import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Song } from '../models/song';
import { AlbumService } from '../services/album.service';
import { UploadService } from '../services/upload.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';


@Component({
    selector: 'song-edit',
    templateUrl: '../views/song-add.html',
    providers: [
        UserService,
        AlbumService,
        SongService,
        UploadService
    ]
})

export class SongEditComponent implements OnInit {
    public titulo: string;
    public song: Song;
    public album: Album;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public album_id;
    public is_edit;
    public filesToUpload;


    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService,        
        private _uploadService: UploadService
    ) {
        this.titulo = 'Editar Cancion';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.song = new Song(1, '', 60, '', '');
        this.album = new Album('', '', 2017, '', '');
        this.is_edit = true;
    }

    ngOnInit() {
        this.getSong();//Sacar la cancion a editar
    }

    getSong() {
        this._route.params.forEach((params: Params) => { //tomo el id del album que recibo por parametros, llamo al getalbum del servicio de album y tomo su titulo.
             let id = params['id'];
            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if (!response.song) {
                        this._router.navigate(['/'])
                    } else {
                        this.song = response.song;
                    }
                },
                error => {
                    //cuando recibimos un error, lo recibimos diferente a cuando recibimos un status200 que es un json usable. en este caso vamos a parsear a json el error para poder usar correctamente el mensaje del error y mostrarlo en la alerta
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        var body = JSON.parse(error._body);
                        //this.alertMessage = body.message;
                        console.log(error);
                    }
                }
            )
        });
    }

    onSubmit() {

        // //para recibir todos los parametros que son enviados por url
        //recibo el id de la cancion a editar
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.editSong(this.token, id, this.song).subscribe(
                response => {

                    if (!response.song) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'La cancion se ha actualizado correctamente!';

                        //subir el fichero de audio
                        if (!this.filesToUpload) {
                            //Redirigirme
                            this._router.navigate(['/album', response.song.album]); //redirecciono a la pag del album
                        } else {
                            //si si tengo cancion para subir
                            this._uploadService.makeFileRequest(this.url + 'upload-file-song/' + id, [], this.filesToUpload, this.token, 'file').then(
                                (result) => {//si si tengo cnacion entonces la subo e igual me voy a esa pagina de artista con el response.album.artist obtengo el id del artista cuyo album que estoy editando
                                    this._router.navigate(['/album', response.song.album]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
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
            )
        });
    }

    //esta es la funcion que se llama detro del formulario de editar artista.
    fileChangeEvent(fileInput: any) {

        //en esta propiedad guardamos el archivo que se va a subir.
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}