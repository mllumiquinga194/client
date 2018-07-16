import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; //nos permite crear formularios. de otra forma no podriamos vincular las propiedades que tenemos en los componenetes con las propiedades que tenemos en las vistas. al modificar el valor de una propiedad en la vista tambien se cambia ese valor en el backend o en este caso, en el modelo del componente. y viseversa, esto cambia los valores tanto en la vista como en el modelo.
import { AppComponent } from './app.component';
import { HttpModule } from "@angular/http";
import { routing, appRoutingProviders } from './app.routing'; //importamos nuestro componente de rutas

//HOME
import { HomeComponent } from './components/home.component';

//USER
import { UserEditComponent } from './components/user-edit.component';
import { UserPassComponent } from './components/user-pass.component';
import { UsersDetailsComponent } from './components/users-details.component';

//ARTIST
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';

//ALBUM
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';
import { AlbumListComponent } from './components/album-list.component';

//SONG
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlayerComponent } from './components/player.component';
import { BusquedaComponent } from './components/busqueda.component';
import { SearchPipe } from './pipes/search.pipe';


@NgModule({
  declarations: [ //declaramos componenetes y directivas
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent,
    AlbumListComponent,
    UserPassComponent,
    UsersDetailsComponent,
    BusquedaComponent,
    SearchPipe
    
  ],
  imports: [//cargamos modulos del framework y modulos que hagamos nosotros
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders], //cargar servicios
  bootstrap: [AppComponent] //punto principal donde carga la aplicacion
})
export class AppModule { }

