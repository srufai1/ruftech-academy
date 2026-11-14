# Own build — The JHS 3 mock scheme

No steps and no hints this time. Build it your way, then compare.

**GPIS D-27 / D-80:** JHS 3 mock — CA out of 30, a whole number; Exam raw out of 100 (or 140
for Integrated Science, D-171), scaled to 70 **as a whole number, halves going up**; Final
out of 100. Work in `~/projects/gpis-rebuild`.

## Requirements

1. `src/lib/mock-marks.ts` exports
   `calculateMockTotal(marks: { ca: RawMark; exam: RawMark }, examMax = 100)`.
2. `parseMark` is reused. A CA with decimals is refused by a new `parseWholeMark`.
3. Exam 80/100 → 56. Exam 112/140 → 56. Exam 113/140 → 57 (56.5 goes up).
4. Blank and `ABS` behave as in the lab: no total, and the right flags.
5. No rule is copied between the two files: what they share is imported.
6. `notes/unit-2-3.md`: a table of five inputs with their results under the normal scheme
   and the mock scheme.

## Who checks it

This build is **self-reviewed**. Go through the six requirements and run a command that
proves each. `npm run typecheck`, `npm test` and `./scripts/verify.sh` must pass.

## Then compare with GPIS

Open `scaledRawExam` in GPIS's `raw-marks.ts`. For the 140 maximum it works in whole cents
with `Math.floor`. Write in `notes/unit-2-3.md`: why might `Math.round(113 / 140 * 70)` and
GPIS's way ever disagree? Try to find a mark where they do.
