import { AnatomicalFilterPipe } from './anatomical-filter.pipe';
import { Pipe, PipeTransform } from '@angular/core';
import { Site } from 'src/app/shared/models/site.model';

describe('AnatomicalFilterPipe', () => {
  let anatomicalFilterPipe: AnatomicalFilterPipe;

  // synchronous beforeEach
  beforeEach(() => {
    anatomicalFilterPipe = new AnatomicalFilterPipe();
  });

  it('should be instanciated', () => {
    expect(anatomicalFilterPipe).toBeDefined();
  });

  it('create an instance', () => {
    const pipe = new AnatomicalFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return whole sites if no site name is given', () => {
    const items: Site[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new Site(index + 1, 'Site' + (index + 1 ), 3);
      items.push(element);
    }
    const filtered = anatomicalFilterPipe.transform(items, '');
    expect(filtered.length).toBe(3);
    expect(filtered).toEqual(items);
  });

  it('should return filtered sites if site name is given', () => {
    const items: Site[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new Site(index + 1, 'Site' + (index + 1 ), 3);
      items.push(element);
    }
    const filtered = anatomicalFilterPipe.transform(items, 'Site1');
    expect(filtered.length).toBeGreaterThanOrEqual(1);
     expect(filtered[0]).toEqual(items[0]);
  });

  it('should return zero sites if we provide wrong site name', () => {
    const items: Site[] = [];
    for (let index = 0; index < 3; index++) {
      const element = new Site(index + 1, 'Site' + (index + 1 ), 3);
      items.push(element);
    }
    const filtered = anatomicalFilterPipe.transform(items, 'Site4');
    expect(filtered.length).toBe(0);
  });
});
