import app from '../../src/server/app';

describe('\'messages\' service', () => {
  it('registered the service', () => {
    const service = app.service('messages');
    expect(service).toBeTruthy();
  });
});
