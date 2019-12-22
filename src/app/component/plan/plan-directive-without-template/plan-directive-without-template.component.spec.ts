import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TargetFilterPipe } from 'src/app/shared/pipe/target-filter.pipe';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppService } from 'src/app/shared/helpers/app-service';
import { RouterTestingModule } from '@angular/router/testing';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { PlanDirectiveWithoutTemplateComponent } from './plan-directive-without-template.component';

describe('PlanDirectiveWithoutTemplateComponent', () => {
  let component: PlanDirectiveWithoutTemplateComponent;
  let fixture: ComponentFixture<PlanDirectiveWithoutTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule],
      declarations: [PlanDirectiveWithoutTemplateComponent, TargetFilterPipe],
      providers: [AppService, PlanDirectiveTemplateDetailsService, PlanDirectiveTemplateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDirectiveWithoutTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
