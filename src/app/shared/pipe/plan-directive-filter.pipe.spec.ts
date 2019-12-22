import { PlanningDirectiveFilterPipe } from './plan-directive-filter.pipe';
import { PlanDirectiveTemplate } from 'src/app/shared/models/plan-directive-template.model';

describe('PlanDirectiveFilterPipe', () => {
  let planningDirectiveFilterPipe: PlanningDirectiveFilterPipe;
     beforeEach(() => {
      planningDirectiveFilterPipe = new PlanningDirectiveFilterPipe();
    });
  it('create an instance', () => {
    const pipe = new PlanningDirectiveFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return whole templates if no template name is given', () => {
    const templates: PlanDirectiveTemplate[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new PlanDirectiveTemplate(index + 1, 'Template' + (index + 1 ), 3, true, 1);
      templates.push(element);
    }
    const filtered = planningDirectiveFilterPipe.transform(templates, '');
    expect(filtered.length).toBe(3);
    expect(filtered).toEqual(templates);
  });

  it('should return filtered templates if template name is given', () => {
    const items: PlanDirectiveTemplate[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new PlanDirectiveTemplate(index + 1, 'Template' + (index + 1 ), 3, true, 1);
      items.push(element);
    }
    const filtered = planningDirectiveFilterPipe.transform(items, 'Template1');
    expect(filtered.length).toBeGreaterThanOrEqual(1);
     expect(filtered[0]).toEqual(items[0]);
  });

  it('should return zero templates if we provide wrong template name', () => {
    const items: PlanDirectiveTemplate[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new PlanDirectiveTemplate(index + 1, 'Template' + (index + 1 ), 3, true, 1);
      items.push(element);
    }
    const filtered = planningDirectiveFilterPipe.transform(items, 'Template4');
    expect(filtered.length).toBe(0);
  });
});
