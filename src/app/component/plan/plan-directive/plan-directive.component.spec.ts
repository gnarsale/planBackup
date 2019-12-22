import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SiteService } from 'src/app/shared/services/site.service';
import { PlanDirectiveTemplateService } from 'src/app/shared/services/plan-directive-template.service';
import { AnatomicalRegionComponent } from 'src/app/component/region/anatomical-region/anatomical-region.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppService } from 'src/app/shared/helpers/app-service';
import { PlanDirectiveTemplateDetailsService } from 'src/app/shared/services/plan-directive-template-details.service';
import { PlanDirectiveComponent } from './plan-directive.component';
import { TitleCasePipe } from 'src/app/shared/pipe/title-case.pipe';
import { AnatomicalFilterPipe } from 'src/app/shared/pipe/anatomical-filter.pipe';
import { PlanningDirectiveFilterPipe } from 'src/app/shared//pipe/plan-directive-filter.pipe';
import { TargetFilterPipe } from 'src/app/shared/pipe/target-filter.pipe';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';
import {
  PlanDirectiveWithoutTemplateComponent
} from 'src/app/component/plan/plan-directive-without-template/plan-directive-without-template.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('PlanDirectiveComponent', () => {
  let component: PlanDirectiveComponent;
  let planTemplateService: PlanDirectiveTemplateService;
  let planDirectiveTemplateDetails: PlanDirectiveTemplateDetailsService;
  let appService: AppService;
  let siteService: SiteService;
  let fixture: ComponentFixture<PlanDirectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
      declarations: [PlanDirectiveComponent, PlanDirectiveWithoutTemplateComponent, AnatomicalRegionComponent, TargetFilterPipe,
        PlanningDirectiveFilterPipe, AnatomicalFilterPipe, TitleCasePipe],
      providers: [SiteService, {
        provide: ActivatedRoute,
        useValue: {
          params: Observable.of({ structureSetId: 'CT_1', patientId: 'JAX16569' })
        }
      },
        PlanDirectiveTemplateService, AppService, PlanDirectiveTemplateDetailsService]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    planTemplateService = TestBed.get(PlanDirectiveTemplateService);
    appService = TestBed.get(AppService);
    fixture = TestBed.createComponent(PlanDirectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should order id using structure set id', async(() => {
    appService.objPlanDirectiveDetails.isBackButtonPressed = false;

    spyOn(planTemplateService, 'getOrderIdByStructureSetId').and.returnValue(Observable.of('Order_2'));
    spyOn(component, 'getPatientNameAndId').and.returnValue(true);
    component.getOrderId();

    fixture.whenStable().then(() => {
      expect(component.orderId).toEqual('Order_2');
    });
  }));

  it('should reset selection of plan directive template on back button click on directive details page', () => {
    appService.objPlanDirectiveDetails.isBackButtonPressed = true;
    appService.objPlanDirectiveDetails.selectedRegionID = '1';
    appService.objPlanDirectiveDetails.selectedSiteID = '2';
    appService.objPlanDirectiveDetails.sites = [{
      PlanDirectiveSiteID: 1, PlanDirectiveSiteName: 'Cranial Central Nervous System',
      PlanDirectiveRegionID: 1
    }];

    appService.objPlanDirectiveDetails.templates = [{
      PlanDirectiveTemplateID: 4, PlanDirectiveTemplateName: 'Oral SCC',
      PlanDirectiveSiteID: 2,
      IsFavourite: false, PlanDirectiveRegionId: 1
    }];

    appService.objPlanDirectiveDetails.templateId = '4';

    component.getOrderId();

    expect(component.selectedregionId).toEqual(1);
    expect(component.selectedSiteId).toEqual(2);
    expect(component.planId).toEqual(4);

    appService.objPlanDirectiveDetails.templateId = '0';
    component.getOrderId();
    expect(component.planId).toEqual(0);
  });

  it('should EXTRACT data from router parameters', async(() => {
    component.getRouteParameters();

    fixture.whenStable().then(() => {
      expect(component.structureSetId).toEqual('CT_1');
      expect(component.patientId).toEqual('JAX16569');
      expect(component.isCreateTemplateDisabled).toEqual(true);
    });
  }));

  it('should fetch Patient name and id using order id', async(() => {
    planDirectiveTemplateDetails = TestBed.get(PlanDirectiveTemplateDetailsService);
    component.orderId = 'Order_2';
    spyOn(planDirectiveTemplateDetails, 'getPatientByOrderId').and.returnValue(
      Observable.from([{ ID: 'JAX16569', Name: 'ABENE SENATOR SNOW', AnonymizedID: null }]));

    component.getPatientNameAndId();

    fixture.whenStable().then(() => {
      expect(appService.objPlanDirectiveDetails.patientName).toEqual('ABENE SENATOR SNOW');
      expect(appService.objPlanDirectiveDetails.patientId).toEqual('JAX16569');
    });
  }));

  it('should fetch Template using site id', async(() => {
    spyOn(planTemplateService, 'getTemplatesBySiteId').and.returnValue(Observable.of(
      [{
        PlanDirectiveTemplateID: 26, PlanDirectiveTemplateName: 'Prostate', PlanDirectiveSiteID: 12,
        PlanDirectiveTemplatePath: '', IsFavourite: false
      }, {
        PlanDirectiveTemplateID: 26, PlanDirectiveTemplateName: 'Prostate', PlanDirectiveSiteID: 12,
        PlanDirectiveTemplatePath: '', IsFavourite: false
      }]));
    spyOn(component, 'getSiteNameBySiteId').and.returnValue(true);
    spyOn(component, 'getFavouriteTemplate').and.returnValue(true);

    component.getTemplates(12);

    fixture.whenStable().then(() => {
      expect(component.plantemplates.length > 1).toBeTruthy();
    });
  }));

  it('should check selected plan template', () => {
    component.selectedPlanTemplate(4);

    expect(component.planId === 4).toBeTruthy();
    expect(component.isPlanTemplateClicked).toBeTruthy();
    expect(component.isFavoriteTemplateClicked).toBeFalsy();
    expect(component.isCreateTemplateDisabled).toBeFalsy();
  });

  it('should check selected favourite plan template', () => {
    component.selectedFavoritePlanTemplate(4);

    expect(component.favoriteTemplateId === 4).toBeTruthy();
    expect(component.isPlanTemplateClicked).toBeFalsy();
    expect(component.isFavoriteTemplateClicked).toBeTruthy();
    expect(component.isCreateTemplateDisabled).toBeFalsy();
  });

  it('should fetch sites using selected region id', async(() => {

    siteService = TestBed.get(SiteService);
    component.selectedregionId = 1;
    spyOn(siteService, 'getSiteByRegionId').and.returnValue(Observable.of(
      [{ PlanDirectiveSiteID: 1, PlanDirectiveSiteName: 'Cranial Central Nervous System', PlanDirectiveRegionID: 1 }]));

    component.getSite();

    fixture.whenStable().then(() => {
      expect(component.sites.length === 1).toBeTruthy();
    });
  }));

  it('should enable site search', () => {
    component.searchSiteName = false;
    component.searchSite();
    expect(component.anatomicalSiteFilter === '').toBeTruthy();
    expect(component.searchSiteName).toBeTruthy();
  });

  it('should enable template search', () => {
    component.searchTemplateName = false;
    component.searchTemplate();
    expect(component.pdtFilter === '').toBeTruthy();
    expect(component.searchTemplateName).toBeTruthy();
  });

  it('should open create directive modal pop up', () => {
    appService.objPlanDirectiveDetails.templateId = '0';
    spyOn(component, 'openModal').and.returnValue(true);
    component.createDirective();
    expect(component.openModal).toHaveBeenCalled();
  });

  it('should navigate to planning-directive-details on click of create button', () => {
    const router = TestBed.get(Router);
    appService.objPlanDirectiveDetails.templateId = '1';
    component.orderId = 'Order_1';
    component.planId = 2;
    component.selectedSiteId = 1;
    spyOn(router, 'navigate').and.returnValue(true);
    component.createDirective();
    expect(router.navigate).toHaveBeenCalledWith(['/planning-directive-details', 'Order_1', 2, 1]);
  });

  it('should go to next tab on click of clock button', () => {
    component.page = 0;
    component.gotoNext();
    expect(component.page === 1).toBeTruthy();
  });

  it('should go to previous tab on click of previous button', () => {
    component.page = 1;
    component.gotoPrev();
    expect(component.page === 0).toBeTruthy();
  });

  it('should get region name using region id', () => {
    appService.objPlanDirectiveDetails.regions = [{ PlanDirectiveRegionID: 1, PlanDirectiveRegionName: 'Head and Neck', IsVisible: true },
    { PlanDirectiveRegionID: 2, PlanDirectiveRegionName: 'Thorax', IsVisible: true },
    { PlanDirectiveRegionID: 3, PlanDirectiveRegionName: 'Abdomen', IsVisible: true }];

    const temp: string = component.getRegionName(1);
    expect(temp === 'Head and Neck').toBeTruthy();
  });

  it('should create plan directive template json in object : Success case', async(() => {
    const router = TestBed.get(Router);
    component.selectedregionId = 1;
    component.orderId = 'Order_2';
    component.selectedSiteId = 1;
    component.selectedStructureCollection = [{ Meaning: 'Primary Gross Tumor Volume', Code: 'GTVp', Name: 'ABCD1' },
    { Meaning: 'Gross Tumor Volume', Code: 'R-429ED', Name: 'ABCD2' }];

    component.phaseTargets = [{
      fractionCount: 10, phaseId: 1, targets: [{ totalDose: 0, doseFraction: 0, isHidden: false, targetId: 'Target1', targetName: 'ABCD1' },
      { totalDose: 0, doseFraction: 0, isHidden: true, targetId: 'Target2', targetName: 'ABCD2' }]
    },
    {
      fractionCount: 10, phaseId: 2, targets: [{ totalDose: 0, doseFraction: 0, isHidden: false, targetId: 'Target1', targetName: 'ABCD1' },
      { totalDose: 0, doseFraction: 0, isHidden: true, targetId: 'Target2', targetName: 'ABCD2' }]
    }];

    appService.objPlanDirectiveDetails.regions = [{ PlanDirectiveRegionID: 1, PlanDirectiveRegionName: 'Head and Neck', IsVisible: true },
    { PlanDirectiveRegionID: 2, PlanDirectiveRegionName: 'Thorax', IsVisible: true },
    { PlanDirectiveRegionID: 3, PlanDirectiveRegionName: 'Abdomen', IsVisible: true }];

    spyOn(planTemplateService, 'getOARs').and.returnValue(Observable.of(
      {
        Structure: [{ Id: 'OAR1', Code: '14544', Schema: 'FMA', Name: 'Kidney Combined', SchemaVersion: '3.2', Meaning: 'Kidney Combined' },
        { Id: 'OAR3', Code: '14544', Schema: 'FMA', Name: 'Colon', SchemaVersion: '3.2', Meaning: 'Colon' }]
      }));
    spyOn(appService, 'changeTreatment').and.returnValue(true);
    spyOn(router, 'navigate').and.returnValue(true);

    component.createTemplate();

    fixture.whenStable().then(() => {
      expect(component.treatmentInstruction.OARs.Structure.length === 2).toBeTruthy();
      expect(component.treatmentInstruction.PrescribedSessions.Session.length === 20).toBeTruthy();
      expect(appService.changeTreatment).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['planning-directive-details', 'Order_2', '0', 1]);
    });
  }));

  it('should create plan directive template json in object : Error case', async(() => {
    spyOn(planTemplateService, 'getOARs').and.returnValue(Observable.throw('error'));

    component.createTemplate();

    fixture.whenStable().then(() => {
      expect(planTemplateService.getOARs).toHaveBeenCalled();
    });
  }));

  it('should clean data on load', () => {
    component.clearDataOnLoad();
    expect(component.isStrucutreSelected).toBeFalsy();
    expect(component.selectedStructureCollection.length === 0).toBeTruthy();
    expect(component.phaseTargets.length === 0).toBeTruthy();
  });

  it('should update total dose and dose fraction in TargetStructure', () => {
    const target = { totalDose: 3, doseFraction: 0.3, isHidden: false, targetId: 'Target2', targetName: 'ABCD2' };
    const phaseTarget = {
      fractionCount: 10, phaseId: 1, targets: [{ totalDose: 0, doseFraction: 0, isHidden: true, targetId: 'Target1', targetName: 'ABCD1' },
      { totalDose: 3, doseFraction: 0.3, isHidden: false, targetId: 'Target2', targetName: 'ABCD2' }]
    };

    component.updateTotalDose(target, phaseTarget, 4);
    expect(target.totalDose === 4).toBeTruthy();
    expect(target.doseFraction === 0.4).toBeTruthy();
    component.updateTotalDose(target, phaseTarget, 0);
    expect(target.doseFraction === 0).toBeTruthy();
  });

  it('should remove added Targets from selectedStructureCollection', () => {
    component.selectedStructureCollection = [{ Meaning: 'Clinical target Volume', Code: 'R-429EB', Name: 'ABCD1' },
    { Meaning: 'Primary Target Volume', Code: 'R-429EC', Name: 'ABCD2' }];

    const structure = { Meaning: 'Primary Target Volume', Code: 'R-429EC', Name: 'ABCD2' };

    component.deleteStructureTarget(structure);
    expect(component.selectedStructureCollection.length === 1).toBeTruthy();
  });

  it('should add selected Target in selectedStructure', () => {
    this.selectedStructureCollection = [];
    component.selectedStructure = { Meaning: 'Clinical target Volume', Code: 'R-429EB', Name: 'ABCD1' };

    component.addSelectedTarget();
    expect(component.selectedStructureCollection.length > 0).toBeTruthy();
  });

  it('should set selected Target', () => {
    this.selectedStructureCollection = [];
    const structure = { Meaning: 'Primary Target Volume', Code: 'R-429EC', Name: 'ABCD2' };

    component.selectStrucutre(structure);
    expect(component.selectedStructure === structure).toBeTruthy();
  });

  it('should undo selected Target', () => {
    component.isStrucutreSelected = true;
    component.undoSelectedStrucutre();
    expect(component.isStrucutreSelected).toBeFalsy();
  });

  it('should update structure name', () => {
    const structure = { Id: 2, Meaning: 'Primary Gross Tumor Volume', Code: 'GTVp', IsActive: true, Name: 'ABCD' };
    component.updateStrucutreName(structure, 'ABCD1', 0);
    expect(structure.Name === 'ABCD1').toBeTruthy();
  });

  it('should filter site name using site id', () => {
    component.sites = [{ PlanDirectiveSiteID: 1, PlanDirectiveSiteName: 'Cranial Central Nervous System', PlanDirectiveRegionID: 1 },
    { PlanDirectiveSiteID: 2, PlanDirectiveSiteName: 'Lips, Oral Cavity and Oropharynx', PlanDirectiveRegionID: 1 },
    { PlanDirectiveSiteID: 3, PlanDirectiveSiteName: 'Major Salivary Gland', PlanDirectiveRegionID: 1 }];

    component.getSiteNameBySiteId(3);
    expect(component.siteName === 'Major Salivary Gland').toBeTruthy();
  });

  it('should get selected phase no', () => {
    component.selectedStructureCollection = [{ Meaning: 'Primary Gross Tumor Volume', Code: 'GTVp', Name: 'ABCD1' },
    { Meaning: 'Gross Tumor Volume', Code: 'R-429ED', Name: 'ABCD2' }];

    component.getSelectedPhaseNumber(2);
    expect(component.phaseTargets.length === 2).toBeTruthy();
    expect(component.phaseTargets[0].targets.length === 2).toBeTruthy();
  });

  it('should update no of fraction', () => {

    const phaseTarget = {
      fractionCount: 0, phaseId: 1, targets: [{ totalDose: 0, doseFraction: 0, isHidden: true, targetId: 'Target1', targetName: 'ABCD1' },
      { totalDose: 3, doseFraction: 0.3, isHidden: false, targetId: 'Target2', targetName: 'ABCD2' }]
    };

    component.updateNumberOfFraction(phaseTarget, 10);
    expect(phaseTarget.fractionCount === 10).toBeTruthy();
    expect(component.numberofFractionError).toBeFalsy();
    component.updateNumberOfFraction(phaseTarget, 0);
    expect(component.numberofFractionError).toBeTruthy();
  });

  it('should enable dose fraction', () => {

    const target = { totalDose: 0, doseFraction: 0, isHidden: true, targetId: 'Target1', targetName: 'ABCD1' };

    component.enableDoseFraction(target);
    expect(target.isHidden).toBeFalsy();
    component.enableDoseFraction(target);
    expect(target.isHidden).toBeTruthy();
  });

  it('should change status of isSiteClicked', () => {
    component.onSearch('major');
    expect(component.isSiteClicked).toBeFalsy();
    component.onSearch('');
    expect(component.isSiteClicked).toBeTruthy();
  });

  it('should fetch favourite template data', async(() => {
    const favTemp = [{
      PlanDirectiveTemplateID: 5, PlanDirectiveTemplateName: 'Oral FSA', PlanDirectiveSiteID: 2,
      PlanDirectiveTemplatePath: '', IsFavourite: true
    },
    {
      PlanDirectiveTemplateID: 6, PlanDirectiveTemplateName: 'Oral Melanoma', PlanDirectiveSiteID: 2,
      PlanDirectiveTemplatePath: '', IsFavourite: true
    },
    {
      PlanDirectiveTemplateID: 7, PlanDirectiveTemplateName: 'Tonsillar SCCa', PlanDirectiveSiteID: 2,
      PlanDirectiveTemplatePath: '', IsFavourite: true
    }];
    spyOn(planTemplateService, 'getFavouriteTemplates').and.returnValue(Observable.of(favTemp));

    component.getFavouriteTemplate(2);

    fixture.whenStable().then(() => {
      expect(appService.objPlanDirectiveDetails.favoriteTemplates.length === 3).toBeTruthy();
    });
  }));

  it('should check selected region and display sites associated with region', () => {
    spyOn(component, 'getSite').and.returnValue(true);
    component.selectedRegion({ type: 'empty Region', event: '' });
    expect(component.searchSiteName).toBeFalsy();
    expect(component.anatomicalSiteFilter).toBe('');
    expect(component.regionselected).toBeFalsy();
    expect(component.sites.length).toBe(0);
    expect(component.isSiteClicked).toBeFalsy();
    expect(component.isPlanTemplateClicked).toBeFalsy();
    expect(component.isFavoriteTemplateClicked).toBeFalsy();
    expect(component.isCreateTemplateDisabled).toBeTruthy();
    expect(appService.objPlanDirectiveDetails.selectedRegionID).toBe('');
    expect(component.plantemplates.length).toBe(0);
    component.selectedRegion({ type: 'Whole Body', event: 6 });
    expect(component.searchSiteName).toBeFalsy();
    expect(component.anatomicalSiteFilter).toBe('');
    expect(component.selectedregionId).toBe(6);
    expect(appService.objPlanDirectiveDetails.selectedRegionID).toBe('6');
  });

  it('should remove template from favourite', async(() => {
    spyOn(planTemplateService, 'deleteFavouriteTemplate').and.returnValue(Observable.of(''));
    spyOn(component, 'FavouriteTemplateCB').and.returnValue(true);

    const plantemplate: PlanDirectiveTemplate = {
      PlanDirectiveTemplateID: 4, PlanDirectiveTemplateName: 'Oral SCC', PlanDirectiveSiteID: 2,
      PlanDirectiveRegionId: 1, IsFavourite: true
    };

    component.templateSelected(plantemplate, true);

    fixture.whenStable().then(() => {
      expect(planTemplateService.deleteFavouriteTemplate).toHaveBeenCalled();
    });
  }));

  it('should add template in favourite', async(() => {
    spyOn(planTemplateService, 'addFavouriteTemplate').and.returnValue(Observable.of([]));
    spyOn(component, 'FavouriteTemplateCB').and.returnValue(true);

    const plantemplate: PlanDirectiveTemplate = {
      PlanDirectiveTemplateID: 4, PlanDirectiveTemplateName: 'Oral SCC', PlanDirectiveSiteID: 2,
      PlanDirectiveRegionId: 1, IsFavourite: true
    };

    component.templateSelected(plantemplate, false);

    fixture.whenStable().then(() => {
      expect(planTemplateService.addFavouriteTemplate).toHaveBeenCalled();
    });
  }));

  it('should fetch template using site id', async(() => {
    const planTemplates = [{
      PlanDirectiveTemplateID: 4, PlanDirectiveTemplateName: 'Oral SCC', PlanDirectiveSiteID: 2,
      PlanDirectiveTemplatePath: 'C:apy.xml', IsFavourite: true
    },
    {
      PlanDirectiveTemplateID: 5, PlanDirectiveTemplateName: 'Oral FSA', PlanDirectiveSiteID: 2, PlanDirectiveTemplatePath: '',
      IsFavourite: true
    }];
    spyOn(component, 'getFavouriteTemplate').and.returnValue(true);
    spyOn(planTemplateService, 'getTemplatesBySiteId').and.returnValue(Observable.of(planTemplates));

    component.FavouriteTemplateCB(2);

    fixture.whenStable().then(() => {
      expect(planTemplateService.getTemplatesBySiteId).toHaveBeenCalled();
    });
  }));
});
