import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { Artist } from '../models/artist';
import { ArtistService } from '../services/artist.service';
@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [
        UserService,
        ArtistService
    ]
})

export class ArtistListComponent implements OnInit {
    public titulo: string;
    public artists: Artist;
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public page;
    public alertMessage;
    public confirmado;
    public numero_paginas;
    public pages;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ) {
        this.titulo = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit() {
        this.getArtists();

    }

    getArtists() {
        this._route.params.forEach((params: Params) => {
            //con el + convertimos el page en numero
            this.page = +params['page'];
            if (!this.page) {
                this.page = 1;
            } else {
                this.prev_page = this.page - 1;
                this.next_page = this.page + 1;

                if (this.prev_page == 0) {
                    this.prev_page = 1;
                }
            }
            

            this._artistService.getArtists(this.token, this.page).subscribe(
                response => {
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = response.artists;

                        let resto = response.total_items % 4;
                        if (resto == 0) {
                            this.numero_paginas = response.total_items / 4;
                            
                        } else {
                            this.pages = response.total_items / 4;
                            this.numero_paginas = parseInt(this.pages) + 1;
                        }


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
            );
        });
    }

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onCancelArtist() {
        this.confirmado = null;
    }

    onDeleteArtist(id) {
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {

                if (!response.artist) {
                    alert('Error en el servidor')
                }
                this.getArtists();
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

}