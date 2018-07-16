import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.html',
    providers: [
        UserService,
        ArtistService,
        AlbumService,
        SongService
    ]
})

export class AlbumDetailComponent implements OnInit {
    public identity;
    public token;
    public song: Song[];
    public url: string;
    public alertMessage;
    public album: Album;
    public confirmado;
    public songs;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _albumService: AlbumService,
        private _songService: SongService
    ) {
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('album-detail.component.ts cargado');
        //Llamar al metodo del api para sacar un album en base a su id getalbum
        this.getAlbum();

    }

    //para mostrar el artista en el formulario
    getAlbum() {
        console.log("el metodo funciona");
        
        this._route.params.forEach((params: Params) => {
            let id = params['id'];
            
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if (!response.album) {
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
                        console.log("album: ",response.album._id);
                        
                        //sacar las camciones de este album
                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            response => {
                                if (!response.songs) {
                                    this.alertMessage = 'Este Album no tiene Canciones';
                                } else {
                                    console.log(response.songs);

                                    this.songs = response.songs;
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

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelSong() {
        this.confirmado = null;
    }

    onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response => {

                if (!response.song) {
                    alert('Error en el servidor')
                }
                this.getAlbum();
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
    }

    startPlayer(song){
        let song_player = JSON.stringify(song);//convertir el objeto que nos llega a un string de JSON para luego guardarla en el localstorage
        let file_path = this.url + 'get-song-file/' + song.file;//guardo la ruta de esa cancion para hacer que persista
        let image_path = this.url + 'get-image-album/' + song.album.image;//guardo la imagen del album de esa cancion para hacer que persista

        localStorage.setItem('sound_song', song_player);//para guardar la cancion que esta sonando
        document.getElementById("mp3-source").setAttribute("src", file_path);//para cambiar los valores que tiene le reproductor

        (document.getElementById("player") as any).load();//para cargar la cancion en el player.
        (document.getElementById("player") as any).play();//y la reproducimos

        document.getElementById('play-song-title').innerHTML = song.name;
        document.getElementById('play-song-artist').innerHTML = song.album.artist.name;
        document.getElementById('play-image-album').setAttribute('src', image_path);
        document.getElementById('repro').innerHTML = 'Reproduciendo';
    }

}