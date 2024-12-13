import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IAtm, IAtmForm } from "../../../models/atm.model";
import { ApiService } from "../../../services/api.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AtmFormService {
    private form: FormGroup = this.fb.group({});;
    constructor(
        private fb: FormBuilder,
        private _http: ApiService
    ) {}

    buildAtmForm(formData?: IAtmForm) {
        this.form = this.fb.group({
            id: [formData?.id || ''],
            atmName: [formData?.atm_name || '', [Validators.required]],
            manufacturer: [formData?.manufacturer || '', [Validators.required]],
            type: [formData?.type || '', [Validators.required]],
            serialNumber: [formData?.serial_number ?? 0, [Validators.required, Validators.pattern('^[0-9]*$')]],
            image: [''],
        });

        return this.form;
    }

    addNewATM(payload: IAtm): Observable<IAtm> {
        return this._http.post('atm', payload);
    }

    updateATM(payload: IAtm): Observable<IAtm> {
        return this._http.put(`atm/${payload?.id}`, payload);
    }

    deleteATM(payload: IAtm): Observable<IAtm> {
        return this._http.delete(`atm/${payload?.id}`);
    }
}