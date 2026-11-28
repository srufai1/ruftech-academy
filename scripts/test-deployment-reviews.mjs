import assert from "node:assert/strict";
import { as, createUser, expectRefused, freshDatabase, rows } from "./lib/pglite-schema.mjs";
import { isDeploymentAddress } from "../apps/web/src/lib/reviews/deployment.ts";

const db = await freshDatabase();
try {
  const a = await createUser(db, { email: "learner@example.test" });
  const b = await createUser(db, { email: "other@example.test" });
  const owner = await createUser(db, { email: "owner@example.test" });
  await db.query("insert into public.content_items(slug,kind,position,title,content_hash) values('m3-p1','project',1,'Portfolio',repeat('a',64))");
  const address = "https://demo.example.test/site";
  const insert = "insert into public.deployment_submissions(item_slug,address,note) values ('m3-p1',$1,'Try the practice site') returning id";
  assert.ok(isDeploymentAddress(address));
  assert.ok(isDeploymentAddress(address + "?page=1#demo"));
  const [{ id }] = await as(db, a.id, () => rows(db, insert, [address]));
  for (const bad of ["http://demo.example.test", "https://user@demo.example.test", "https://demo.example.test/a b"]) {
    assert.equal(isDeploymentAddress(bad), false);
    await as(db, a.id, () => expectRefused(db, insert, [bad], /constraint/));
  }
  const review = "insert into public.deployment_reviews(submission_id,confirmed,reason) values($1,true,'The synthetic demo worked')";
  await as(db, a.id, () => expectRefused(db, review, [id], /row-level/));
  await as(db, b.id, async () => assert.deepEqual(await rows(db, "select id from public.deployment_submissions"), []));
  await as(db, owner.id, async () => {
    assert.deepEqual(await rows(db, "select id from public.deployment_submissions"), [{ id }]);
    await db.query(review, [id]);
    await expectRefused(db, review, [id], /unique/);
    await expectRefused(db, "update public.deployment_reviews set confirmed=false", [], /permission denied/);
    await expectRefused(db, "delete from public.deployment_reviews", [], /permission denied/);
  }, { role: "owner" });
  await as(db, a.id, async () => assert.deepEqual(await rows(db, "select confirmed from public.deployment_reviews"), [{ confirmed: true }]));
  await as(db, b.id, async () => assert.deepEqual(await rows(db, "select confirmed from public.deployment_reviews"), []));
  console.log("Deployment reviews: HTTPS validation, private submissions, owner decisions and immutable history passed.");
} finally { await db.close(); }
