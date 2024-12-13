import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AtmService } from "./atm.service";
import { debounceTime, Subject, takeUntil } from "rxjs";
import { IAtm, IAtmForm } from "../../models/atm.model";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AtmFromModal } from "./atm-form-modal/atm-form-modal.component";
import { DEBOUNCE_TIME } from "../../const/common.const";
import { MatDialog } from "@angular/material/dialog";
import { isNumberInNumber, isStringInString } from "../../utils/helper";
import { AtmFormService } from "./atm-form-modal/atm-form.service";
import { ToastService } from "../../services/toast.service";
import jsPDF from "jspdf";

@Component({
    selector: 'app-atm',
    templateUrl: './atm.component.html',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        CommonModule,
        ReactiveFormsModule,
        AtmFromModal
    ],
    styleUrl: './atm.component.scss'
})
export class AtmComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<void>();
    displayedColumns: string[] = ['atm_name', 'manufacturer', 'type', 'serial_number', 'image', 'actions'];
    pageSizeOptions: number[] = [10, 20, 50, 100];
    atmMachineList: IAtm[] = [];
    isMobile = false;
    searchControl = new FormControl<string>('');
    dataSource = new MatTableDataSource<IAtm>([]);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private atmService: AtmService,
        private atmFormService: AtmFormService,
        private toastService: ToastService,
        private dialog: MatDialog
    ) {}

    @HostListener('window:resize', [])
    onResize() {
        this.checkMobile();
    }

    ngOnInit() {
        this.checkMobile();
        this.atmService.loadAtmListData();
        this.subscribeAtmList();
        this.subscribeSearch();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    subscribeAtmList() {
        this.atmService.atmList$.pipe(takeUntil(this.destroy$))
            .subscribe((atmList) => {
                this.dataSource.data = atmList
            })
    }

    subscribeSearch() {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(DEBOUNCE_TIME),
                takeUntil(this.destroy$)
            )
            .subscribe((searchText) => {
                this.dataSource.filterPredicate = (data: IAtm, text: string) => {
                    const { atm_name, manufacturer, type, serial_number } = data;
                    return  isStringInString(atm_name, text) ||
                            isStringInString(manufacturer, text) ||
                            isStringInString(type, text) ||
                            isNumberInNumber(serial_number, Number(text));
                  };
                this.dataSource.filter = (searchText || '').trim()?.toLowerCase();
            })
    }

    openFormModal(data?: IAtmForm) {
        this.dialog.open(AtmFromModal, {
            width: this.isMobile ? '95vw':'60vw',
            data
        });
    }

    handleViewATM(data: IAtm) {
        this.openFormModal({...data, isViewMode: true });
    }

    deleteATM(data: IAtm) {
        this.atmFormService.deleteATM(data).subscribe((atm) => {
            if(atm.id) {
                this.toastService.show(`deleted ${data?.atm_name}`);
                this.atmService.fetchATMData();
            }
        });
    }

    addNewATM() {
        this.openFormModal();
    }

    editATM(data: IAtm) {
        this.openFormModal(data);
    }

    exportData() {
        const doc = new jsPDF();
        const recordsPerPage = 20;
        let yPosition = 10;

        doc.setFontSize(14);
        doc.text('ATM Data Report', 20, yPosition);
        yPosition += 10;

        for (let i = 0; i < this.atmService.atmList.length; i++) {
            if (i % recordsPerPage === 0 && i !== 0) {
                doc.addPage();
                yPosition = 10;
                doc.text('ATM Data Report', 20, yPosition);
                yPosition += 10;
            }

            const item = this.atmService.atmList[i];
            doc.setFontSize(10);
            doc.text(`ATM Name: ${item.atm_name} - Manufacturer: ${item.manufacturer} - Serial Number: ${item.serial_number} - Type: ${item.type}`, 20, yPosition);
            yPosition += 10;
        }

        doc.save('data.pdf');
    }

    refreshTable() {
        this.atmService.fetchATMData();
    }

    checkMobile() {
        this.isMobile = window.innerWidth <= 768;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}