import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from './Common/header/header.component';
import { FooterComponent } from './Common/footer/footer.component';
import { SidemenuComponent } from './Common/sidemenu/sidemenu.component';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    FooterComponent,
    SidemenuComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatIconModule,
    FontAwesomeModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
