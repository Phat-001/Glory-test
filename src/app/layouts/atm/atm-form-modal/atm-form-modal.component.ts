import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { AtmFormService } from "./atm-form.service";
import { IAtm, IAtmForm } from "../../../models/atm.model";
import { AtmService } from "../atm.service";
import { ToastService } from "../../../services/toast.service";
import { Router, RouterModule } from "@angular/router";

@Component({
    selector: 'app-atm-form-modal',
    templateUrl: './atm-form-modal.component.html',
    standalone: true,
    imports: [
        MatButtonModule,
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatInputModule,
        RouterModule 
    ],
    styleUrl: './atm-form-modal.component.scss'
})
export class AtmFromModal implements OnInit {
    atmForm!: FormGroup;
    formTitle = '';
    constructor(
        private atmFormService: AtmFormService,
        private atmService: AtmService,
        @Inject(MAT_DIALOG_DATA) public atmFormdata: IAtmForm,
        private dialogRef: MatDialogRef<AtmFromModal>,
        private toastService: ToastService,
        private router: Router
    ) {}

    get isViewMode() {
        if (!this.atmFormdata) {
            return false;
        }
        const { id, isViewMode } = this.atmFormdata;
        return id && isViewMode;
    }

    get isEdit() {
        if (!this.atmFormdata) {
            return false;
        }
        const { id, isViewMode } = this.atmFormdata;
        return id && !isViewMode;
    }

    ngOnInit(): void {
        this.atmForm = this.atmFormService.buildAtmForm(this.atmFormdata);

        if (this.isViewMode) {
            this.atmForm.disable();
        }
    }

    closeForm() {
        this.dialogRef.close();
    }

    navigateToAtmDetail(id: string) {
        this.dialogRef.close();
        this.router.navigate(['/home/atm', id]);
    }

    submitForm() {
        if (!this.atmForm.valid) {
            return;
        }
        const formValue = this.atmForm.value;

        const payload: IAtm = {
            id: this.isEdit ? formValue?.id : '',
            atm_name: formValue.atmName,
            manufacturer: formValue.manufacturer,
            serial_number: formValue.serialNumber,
            image: '',
            type: formValue.type,
        }

        if (this.isEdit) {
            this.atmFormService.updateATM(payload).subscribe({
                next: (atm) => {
                    if (atm.id) {
                        this.toastService.show(`edited ${atm?.atm_name}`);
                        this.atmService.fetchATMData();
                    }
                },
                error: () => {
                    this.toastService.show('edit failed');
                }
            });
        } else {
            this.atmFormService.addNewATM(payload).subscribe({
                next: (atm) => {
                    if (atm.id) {
                        this.toastService.show(`added ${atm?.atm_name}`);
                        this.atmService.fetchATMData();
                    }
                },
                error: () => {
                    this.toastService.show('add failed');
                }
            });
        }

        this.dialogRef.close();
    }
}