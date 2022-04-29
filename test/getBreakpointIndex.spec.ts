import { setupJSDOM } from './setup';
import { PushInScene } from '../src/pushinScene';

describe('getBreakpointIndex', () => {
  beforeEach(() => {
    setupJSDOM(`
        <!DOCTYPE html>
            <body>
                <div class="pushin">
                    <div class="pushin-scene">Text</div>
                </div>
            </body>
        </html>`);
    const container = document.querySelector<HTMLElement>('.pushin');
  });

  it('Should return 0 by default', () => {
    const result = PushInScene.prototype.getBreakpointIndex([]);
    expect(result).toEqual(0);
  });

  it('Should return the index of the nearest breakpoint that is less than current window width', () => {
    window.innerWidth = 800;
    const result = PushInScene.prototype.getBreakpointIndex([0, 768, 1440, 1920]);
    expect(result).toEqual(1);
  });
});
