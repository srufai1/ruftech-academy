# Arrays, objects and sorting

This lesson has two parts. Part A is about lists and the things in them. Part B turns a list
of totals into class positions.

## Part A

## A1. Arrays

An **array** is a list: `const totals = [90, 90, 80];`

- The first item is `totals[0]`; the index starts at 0. `totals.length` is 3.
- `totals.push(70)` adds at the end. `totals.at(-1)` reads the last item.
- `totals[10]` past the end gives `undefined`, not an error. Watch for it.

## A2. Objects

An **object** groups named values: `const pupil = { id: "s1", total: 150 };`

- `pupil.total` reads a property.
- **Destructuring** takes properties out: `const { id, total } = pupil;`
- **Spread** copies: `const copy = { ...pupil, total: 151 };` — a new object; `pupil` is
  unchanged.

A class is an array of objects: `[{ id: "s1", total: 150 }, { id: "s2", total: 130 }]`.

## A3. References

```js
const a = [3, 1];
const b = a;      // not a copy: two names for ONE array
b.sort();
a[0];             // 1 — a changed too
```

`const` stops you giving `a` a new value. It does not stop the array from changing. To change
something safely, copy it first: `[...a]`, or use `a.toSorted(…)`, which returns a sorted
copy.

## A4. Loops

| Tool | Gives | Example |
| :--- | :--- | :--- |
| `for (const x of list)` | Whatever you do in the loop | Add up, stop early |
| `list.map(f)` | A new array, same length | Students → their totals |
| `list.filter(f)` | A new array, fewer items | Only active students |
| `list.reduce(f, start)` | One value | The sum of all totals |

Choose the one that says what you mean. A `for…of` loop is always fine.

## A5. Sorting

`list.sort(compare)` sorts **in place**: it changes `list`. The compare function gets two
items and returns a negative number (a first), positive (b first) or 0 (keep their order):

```js
students.toSorted((a, b) => b.total - a.total); // biggest total first, a new array
```

Without a compare function, `sort()` compares **as text**: `[10, 9, 100].sort()` gives
`[10, 100, 9]`. Always pass one for numbers.

Sorting is **stable**: two equal items keep the order they had.

Stop here. Do steps 1–4 of the guided example. Then read Part B.

## Part B

## B1. Ranking

D-02: standard competition ranking. **My position = 1 + the number of pupils with a strictly
higher total.** Pupils with equal totals share a position, and the next position jumps.

```text
 total   sorted   competition (D-02)   dense (not GPIS)
  91       91          1                   1
  91       91          1                   1
  91       91          1                   1
  77       77          4   ← three are ahead  2
  64       64          5                   3
  64       64          5                   3
```

## B2. Dense ranking, and why not

Dense ranking gives 1, 1, 1, 2, 3, 3. It hides how many pupils are ahead: "2nd" would mean
three pupils beat you. D-02 says it is wrong for GPIS.

## B3. Keeping the order

A function that ranks must return the positions **in the order it was given**, so the caller
can match row 3 to pupil 3. Two ways: count higher totals for each pupil in place, or rank a
sorted **copy** and write each position back by its original index. Never sort the caller's
array.

## B4. Decimals

`0.1 + 0.2` is `0.30000000000000004`. Computers store most decimals almost, not exactly.
Round a total to two places: `Math.round(x * 100) / 100`. Two totals that should be equal are
then equal, and tie as they should.

## B5. Missing values

A pupil who missed a subject has `null` for it. Q-07: the missing subject adds **nothing**,
and the pupil still gets a position. `null` is not 0 — 0 means "scored nothing" — and it does
not remove the pupil.

## B6. In GPIS

D-03: ranking is on total score, inside **one** class, never across classes. D-04: only
pupils with an open membership **and** `status = 'active'` are ranked. A withdrawn pupil
must not move anyone's position. The position word ("1st", "22nd") is made in one place.

## Common mistakes

1. `list.sort()` on the caller's array → the screen's order changes too → sort a copy.
2. Default `sort()` on numbers → 100 comes before 9 → always pass a compare function.
3. Position = index + 1 after sorting → tied pupils get different positions → count the
   higher totals.
4. Treating `null` as 0 → a pupil who missed a subject "scored nothing" → skip it in the sum.
5. Ranking two classes in one call → positions mean nothing → one class per call.

## Words to remember

array · index · object · property · destructuring · spread · reference · copy · `map` ·
`filter` · `reduce` · compare function · stable sort · competition ranking · dense ranking
