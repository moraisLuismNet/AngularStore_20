import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/NavbarComponent';

@Component({
  selector: 'app-store',
  templateUrl: './StoreComponent.html',
  styles: [],
  imports: [RouterModule, NavbarComponent],
})
export class StoreComponent {}
