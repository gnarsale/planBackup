import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AppService } from 'src/app/shared/helpers/app-service';
import {
    PlanDirectiveDetailsComponent
} from 'src/app/component/plan/plan-directive-details/plan-directive-details.component';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<PlanDirectiveDetailsComponent> {
    constructor(public appService: AppService) { }

    canDeactivate(component: PlanDirectiveDetailsComponent): boolean {

        if (!component.disableSaveOptions && !this.appService.objPlanDirectiveDetails.isBackButtonPressed) {
            if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
                return true;
            } else {
                return false;
            }
        }
        return true;
    }
}
