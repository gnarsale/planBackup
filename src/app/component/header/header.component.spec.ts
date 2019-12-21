import { fakeAsync, async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DataServiceService } from 'src/app/shared/services/data-service.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let service: DataServiceService;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [DataServiceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.get(DataServiceService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch this.styleConfigured value from json file', async(() => {
    const pMock = {
      subscribe: (data) => component.styleConfigured = 'varian'
    };
    spyOn(service, 'getConfiguredStyle').and.returnValue(pMock);
    component.ngOnInit();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.styleConfigured).toEqual('varian');
    });
  }));

  it('navigate to "https://www.varian.com/"', fakeAsync(() => {
    const pMock = {
      subscribe: (data) => component.styleConfigured = 'varian'
    };
    spyOn(service, 'getConfiguredStyle').and.returnValue(pMock);
    component.ngOnInit();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      router = TestBed.get(Router);
      location = TestBed.get(Location);
      router.initialNavigation();

      router.navigate(['https://www.varian.com/']);
      tick();
      expect(location.path()).toBe('https://www.varian.com/');
    });
  }));

});
