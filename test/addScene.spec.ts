import { setupJSDOM } from './setup';
import { PushIn } from '../src/pushin';

describe('addScene', () => {
  let textContent: string;
  let pushIn: PushIn;

  beforeEach(() => {
    textContent = 'FooBar';
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">${textContent}</div>
                </div>
            </body>
        </html>`);

    const container = document.querySelector<HTMLElement>('.pushin');
    pushIn = new PushIn(container);
  });

  afterEach(() => pushIn.destroy());

  it('Should assign existing .pushin-scene element to the scene property', () => {
    pushIn['addScene']();
    const result = pushIn['scene'].textContent;
    expect(result).toEqual(textContent);
  });

  it("Should create new .pushin-scene element if it doesn't yet exist", () => {
    document.querySelector('.pushin-scene').remove();
    pushIn['addScene']();
    const result = pushIn['scene'].classList.contains('pushin-scene');
    expect(result).toEqual(true);
  });

  it('Should move any inner HTML into the new scene element as children', () => {
    const innerHTML = '<span>FooBar</span>';
    document.querySelector('.pushin-scene').remove();
    document.querySelector('.pushin').innerHTML = innerHTML;
    pushIn['addScene']();
    const result = pushIn['scene'].innerHTML;
    expect(result).toEqual(innerHTML);
  });
});
