import { DateformatPipe } from './dateformat.pipe';

describe('DateformatPipe', () => {
  let dateformatPipe: DateformatPipe;

  // synchronous beforeEach
  beforeEach(() => {
    dateformatPipe = new DateformatPipe();
  });
  it('create an instance', () => {
    const pipe = new DateformatPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return date in dd/mm/yyyy if we provide date in yyyy/mm/dd format', () => {
    const unformattedDate = '1546949013130';
    const formattedDate = dateformatPipe.transform(unformattedDate);
    expect(formattedDate).toBe('08/01/2019');
  });

  it('should return date in dd/mm/yyyy if we provide date in mm/dd/yyyy', () => {
    const unformattedDate = '05/26/2019';
    const formattedDate = dateformatPipe.transform(unformattedDate);
    expect(formattedDate).toBe('26/05/2019');
  });

});
