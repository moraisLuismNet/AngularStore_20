import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-store',
  templateUrl: './store.html',
  styles: [],
  imports: [RouterModule, NavbarComponent],
})
export class StoreComponent {}
