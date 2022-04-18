import { PushIn } from '../src/pushin';

describe('Server-side rendering', () => {
  it('should not throw an exception when code is being run in Node.js environment', () => {
    expect(typeof window).toEqual('undefined');

    expect(() => {
      const pushIn = new PushIn(null);
      pushIn.start();
      pushIn.destroy();
    }).not.toThrow();
  });
});
