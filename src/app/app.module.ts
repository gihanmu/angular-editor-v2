import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { EditorModule } from '@progress/kendo-angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { EditorComponent } from './editor/editor.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { WindowModule } from '@progress/kendo-angular-dialog';

import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    EditorModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    InputsModule,
    DropDownsModule,
    ButtonsModule,
    WindowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
