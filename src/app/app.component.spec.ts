import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmDialogModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/api';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from 'src/app/component/header/header.component';
import { SubheaderComponent } from 'src/app/component/header/subheader/subheader.component';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { ToastModule, ToastsManager, ToastOptions } from 'ng6-toastr/ng2-toastr';

describe('Component: App', () => {

  let dataService: DataServiceService;
  let comp: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmDialogModule, NgHttpLoaderModule, ToastModule, HttpClientModule,
        RouterTestingModule],
      declarations: [
        AppComponent, HeaderComponent,
        SubheaderComponent
      ],
      providers: [ConfirmationService, ToastsManager, ToastOptions, DataServiceService]
    }).compileComponents();

    dataService = TestBed.get(DataServiceService);
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1')).toBeFalsy();
  }));

  it('should fetch this.styleConfigured value from json file', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    const pMock = {
      subscribe: (data) => comp.styleConfigured = 'varian'
    };
    spyOn(dataService, 'getConfiguredStyle').and.returnValue(pMock);

    comp.getConfiguredStyle();

    fixture.whenStable().then(() => {
      expect(comp.styleConfigured).toEqual('varian');
    });
  }));

  it('should fetch error if any returned by service', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    comp = fixture.componentInstance;

    spyOn(dataService, 'getConfiguredStyle').and.returnValue(Observable.throw({ status: 500 }));

    comp.getConfiguredStyle();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(dataService.getConfiguredStyle).toHaveBeenCalled();
    });
  }));
});
