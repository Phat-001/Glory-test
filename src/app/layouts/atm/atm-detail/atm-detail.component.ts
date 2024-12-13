import { Component, OnInit } from "@angular/core";
import { AtmService } from "../atm.service";
import { IAtm } from "../../../models/atm.model";
import { ActivatedRoute } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";

@Component({
    standalone: true,
    selector: 'app-atm-detail',
    imports: [CommonModule],
    templateUrl: './atm-detail.component.html',
    styleUrl: './atm-detail.component.scss'
})
export class AtmDetail implements OnInit {
    atm?: IAtm;
    constructor(private atmService: AtmService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        const postId = Number(this.route.snapshot.paramMap.get('id'));
        this.atmService.getAtmDetail(`${postId}`).subscribe(atm => {
            this.atm = atm;
        })
    }
}