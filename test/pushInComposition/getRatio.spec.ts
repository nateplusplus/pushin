import { setupJSDOM } from '../setup';
import { PushInComposition } from '../../src/pushInComposition';
jest.mock('../../src/pushInLayer');

describe('getRatio', () => {
  let element: HTMLElement;
  let mockComposition: PushInComposition;

  beforeEach(() => {
    setupJSDOM(`
      <!DOCTYPE html>
          <body>
              <div class="pushin">
                  <div class="pushin-scene">
                      <div class="pushin-composition">
                        <!-- layers.. -->
                      </div>
                  </div>
              </div>
          </body>
      </html>`);

    element = <HTMLElement> document.querySelector('.pushin-composition');
    mockComposition = Object.create(PushInComposition.prototype);
    Object.assign(mockComposition, {  container: element, options: {} });
  });

  it('Should return null by default', () => {
    const result = mockComposition['getRatio']();
    expect(result).toBeNull;
  });

  it('Should return ratio from data-attribute', () => {
    element.setAttribute('data-pushin-ratio', '16,9');
    mockComposition['options'].ratio = [3,4];
    const result = mockComposition['getRatio']();
    expect(result).toEqual([16,9]);
  });

  it('Should return ratio from JS API', () => {
    mockComposition['options'].ratio = [3,4];
    const result = mockComposition['getRatio']();
    expect(result).toEqual([3,4]);
  });
});
