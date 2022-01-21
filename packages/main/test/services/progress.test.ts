import app from "../../src/server/app";

describe("'progress' service", () => {
  it("registered the service", () => {
    const service = app.service("progress");
    expect(service).toBeTruthy();
  });
});
