import { setupJSDOM } from '../setup';
import { PushInComposition } from '../../src/pushInComposition';

describe('setRatio', () => {
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
    Object.assign(mockComposition, {  container: element, settings: {} });
  });

  it('Should not change padding by default', () => {
    mockComposition['setRatio']();

    const result = element.style.paddingTop;
    expect(result).toBeNull;
  });

  it('Should not change padding by default', () => {
    mockComposition['settings'].ratio = [16, 9];
    mockComposition['setRatio']();

    const result = element.style.paddingTop;
    expect(result).toEqual('56.25%');
  });
});
