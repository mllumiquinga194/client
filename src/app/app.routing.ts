import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Import HOme
import { HomeComponent } from './components/home.component';

//Import user
import { UserEditComponent } from './components/user-edit.component';
import { UserPassComponent } from './components/user-pass.component';
import { UsersDetailsComponent } from './components/users-details.component';

//import artist
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//Import album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';

//import SONG
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { BusquedaComponent } from './components/busqueda.component';



const appRoutes: Routes = [

    { path: '', component: HomeComponent },//la ruta vacia
    { path: 'artistas/:page', component: ArtistListComponent },//recibe el parametro page para configurar una especie de paginado
    { path: 'crear-artista', component: ArtistAddComponent },
    { path: 'crear-tema/:album', component: SongAddComponent },
    { path: 'editar-artista/:id', component: ArtistEditComponent },
    { path: 'artista/:id', component: ArtistDetailComponent },
    { path: 'albums', component: AlbumListComponent },
    { path: 'crear-album/:artist', component: AlbumAddComponent },
    { path: 'editar-album/:id', component: AlbumEditComponent },
    { path: 'editar-tema/:id', component: SongEditComponent },
    { path: 'album/:id', component: AlbumDetailComponent },
    { path: 'mis-datos/:id', component: UserEditComponent },//ruta de mis datos
    { path: 'usuarios', component: UsersDetailsComponent },
    { path: 'buscar', component: BusquedaComponent },
    { path: 'mi-contrasena', component: UserPassComponent },//ruta de mis datos
    { path: '**', component: HomeComponent } //si colocan una ruta que no existe
];
//exportar la configuracion de la ruta y el modulo de la ruta
export const appRoutingProviders: any[] = []; //lo exportamos como servicio. configuracion necesaria para el routes
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);