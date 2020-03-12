import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridstackModule } from '@libria/gridstack';
import { FloorplanComponent } from './floorplan/floorplan.component';

@NgModule({
  declarations: [
    AppComponent,
    FloorplanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridstackModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
