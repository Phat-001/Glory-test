import { Injectable } from "@angular/core";
import { BehaviorSubject, tap } from "rxjs";
import { IAtm } from "../../models/atm.model";
import { ApiService } from "../../services/api.service";
import { ATM_LIST_KEY } from "../../const/atm.const";
import { StorageService } from "../../services/storage.service";

@Injectable({
    providedIn: 'root'
})
export class AtmService {
    private atmListBS = new BehaviorSubject<IAtm[]>([]);
    public atmList$ = this.atmListBS.asObservable();

    get atmList() {
        return this.atmListBS.getValue();
    }

    setAtmList (data: IAtm[]) {
        this.atmListBS.next(data);
    }

    constructor(private _http: ApiService, private _storage: StorageService) {}

    loadAtmListData() {
        const localAtmList = this._storage.getItem(ATM_LIST_KEY);
        if (localAtmList) {
            this.setAtmList(localAtmList);
        } else {
            this.fetchATMData();
        }
    }

    fetchATMData() {
        this._http.get<IAtm[]>('atm').pipe(tap(atmList => {
            this.setAtmList(atmList);
            this._storage.setItem(ATM_LIST_KEY, JSON.stringify(atmList));
        })).subscribe();
    }

    getAtmDetail(atmId: string) {
        return this._http.get<IAtm>(`atm/${atmId}`);
    }
}