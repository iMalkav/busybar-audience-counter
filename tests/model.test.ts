import assert from "node:assert/strict";
import test from "node:test";
import schema from "../src/appmeta/settings.json" with { type: "json" };
import { AppModel } from "../src/model.ts";
import { schemaDefaults, type Settings } from "../src/lib.ts";
const NOW = 1700000000000;
const make = (values: Settings = {}, saved: Settings = {}, now = NOW) =>
  new AppModel({ ...schemaDefaults(schema.fields), ...values }, saved, now);

test("format changes at a million and decreases are accepted", () => {
  const a = make();
  a.receive({ channels: [{ name: "Channel", count: 1000000 }] }, NOW);
  assert.equal(a.view(NOW).value, "1.0M");
  a.receive({ channels: [{ name: "Channel", count: 999 }] }, NOW + 1);
  assert.equal(a.view(NOW).value, "999");
});
test("missing count does not become zero", () => {
  const a = make();
  assert.throws(() => a.receive({ channels: [{ name: "Channel" }] }, NOW));
  assert.equal(a.items.length, 0);
});
