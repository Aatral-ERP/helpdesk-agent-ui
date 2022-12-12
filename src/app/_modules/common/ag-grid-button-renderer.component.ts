
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
    selector: 'app-staff-expense-button-renderer',
    template: `<span class="pointer" (click)="onClick($event)">{{label}}
    
    <span [innerHTML]="icon"></span>
    </span>
    `
})

export class AGGridButtonRendererComponent implements ICellRendererAngularComp {

    params;
    label: string;
    icon = "<i class='fas fa-edit text-primary'></i>";

    agInit(params): void {
        this.params = params;
        this.label = this.params.label || null;
        if (this.params.iconURL !== undefined)
            this.icon = this.params.iconURL;
    }

    refresh(params?: any): boolean {
        return true;
    }

    onClick($event) {
        if (this.params.onClick instanceof Function) {
            // put anything into params u want pass into parents component
            const params = {
                event: $event,
                rowData: this.params.node.data
                // ...something
            }
            this.params.onClick(params);

        }
    }
}