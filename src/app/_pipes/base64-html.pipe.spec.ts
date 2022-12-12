import { Base64HTMLPipe } from './base64-html.pipe';

describe('Base64HTMLPipe', () => {
  it('create an instance', () => {
    const pipe = new Base64HTMLPipe();
    expect(pipe).toBeTruthy();
  });
});
