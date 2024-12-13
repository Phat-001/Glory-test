import { Component } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    imports: [RouterOutlet, MatToolbarModule, MatInputModule, FormsModule, MatIconModule, RouterModule],
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}