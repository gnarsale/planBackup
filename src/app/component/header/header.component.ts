import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataServiceService } from 'src/app/shared/services/data-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  styleConfigured: string;

  constructor(private dataServiceService: DataServiceService) { }

  ngOnInit() {
    this.getConfiguredStyle();
  }

  getConfiguredStyle(): void {
    this.dataServiceService.getConfiguredStyle().subscribe(
      data => {
        this.styleConfigured = data.configureStyle;
        if (this.styleConfigured !== 'oncology360' && this.styleConfigured !== 'varian') {
          this.styleConfigured = 'varian';
        }
      }
    );
  }
}
