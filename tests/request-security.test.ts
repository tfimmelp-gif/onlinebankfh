import assert from "node:assert/strict";
import test from "node:test";
import { validateMutationRequest } from "../server/security/request";

test("production mutations validate against the configured public origin", () => {
  const previous = process.env.NORTHSTAR_HOST;
  process.env.NORTHSTAR_HOST = "bank.siimplot.com";
  try {
    const request = new Request("http://app:4007/api/admin/session", {
      method: "POST",
      headers: {
        origin: "https://bank.siimplot.com",
        "sec-fetch-site": "same-origin",
        "x-forwarded-host": "bank.siimplot.com",
        "x-forwarded-proto": "https",
      },
    });
    assert.equal(validateMutationRequest(request), null);
  } finally {
    if (previous === undefined) delete process.env.NORTHSTAR_HOST;
    else process.env.NORTHSTAR_HOST = previous;
  }
});

test("production mutations still reject a foreign origin", () => {
  const previous = process.env.NORTHSTAR_HOST;
  process.env.NORTHSTAR_HOST = "bank.siimplot.com";
  try {
    const request = new Request("http://app:4007/api/admin/session", {
      method: "POST",
      headers: {
        origin: "https://attacker.example",
        "sec-fetch-site": "same-origin",
      },
    });
    assert.deepEqual(validateMutationRequest(request), { error: "ORIGIN_REJECTED", status: 403 });
  } finally {
    if (previous === undefined) delete process.env.NORTHSTAR_HOST;
    else process.env.NORTHSTAR_HOST = previous;
  }
});
