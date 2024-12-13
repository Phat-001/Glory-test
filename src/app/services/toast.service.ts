import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    constructor(private snackBar: MatSnackBar) {}

    show(text: string) {
        this.snackBar.open(text, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }
}