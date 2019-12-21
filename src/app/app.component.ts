import { Component, ViewContainerRef } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { Spinkit } from 'ng-http-loader';
import { ToastsManager, ToastOptions } from 'ng6-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  styleConfigured: string;
  public spinkit = Spinkit;

  constructor(private dataServiceService: DataServiceService, private toastOptions: ToastOptions,
    public toastr: ToastsManager, public vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.getConfiguredStyle();
    this.toastOptionSetting();
  }

  getConfiguredStyle(): void {
    this.dataServiceService.getConfiguredStyle().subscribe(
      data => {
        this.styleConfigured = data.configureStyle;
        if (this.styleConfigured !== 'oncology360' && this.styleConfigured !== 'varian') {
          this.styleConfigured = 'varian';
        }
      },
      (error) => {
      }
    );
  }

  toastOptionSetting() {
    this.dataServiceService.getMessageSettings().subscribe(
      data => {
        this.toastOptions.toastLife = data.ToastLife;
        this.toastOptions.showCloseButton = data.ShowCloseButton;
        this.toastOptions.positionClass = data.PositionClass;
        this.toastOptions.animate = data.Animate;
        this.toastOptions.dismiss = data.Dismiss;
        this.toastOptions.maxShown = data.MaxShown;
      }
    );

  }
}
