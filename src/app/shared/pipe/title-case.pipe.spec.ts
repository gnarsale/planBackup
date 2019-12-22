import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
  let titleCasePipe: TitleCasePipe;
  beforeEach(() => {
    titleCasePipe = new TitleCasePipe();
  });

  it('create an instance', () => {
    const pipe = new TitleCasePipe();
    expect(pipe).toBeTruthy();
  });
  it('should return the Camel case Patient name', () => {
    let patientName = 'rUffin abDulLah';

    let name = titleCasePipe.transform(patientName);
    expect(name).toBe('Ruffin Abdullah');
    patientName = null;
    name = titleCasePipe.transform(patientName);
    expect(name).toBe('');

  });
});
