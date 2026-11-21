// Test double for failures that would otherwise require breaking a browser installation.
const fixture = { failAt: "", message: "", calls: [] };
module.exports = {
  fixture,
  chromium: {
    async launch() {
      fixture.calls.push("launch");
      if (fixture.failAt === "launch") throw new Error(fixture.message);
      return {
        version: () => "test",
        async newPage() {
          fixture.calls.push("newPage");
          return {
            async goto(url) {
              fixture.calls.push(url);
              if (fixture.failAt === "goto") throw new Error(fixture.message);
              if (fixture.failAt === "stall") await new Promise(() => {});
            },
            async close() { fixture.calls.push("page.close"); },
          };
        },
        async close() { fixture.calls.push("browser.close"); },
      };
    },
  },
};
