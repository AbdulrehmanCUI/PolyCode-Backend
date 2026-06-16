# Lesson 10 — Debugging and DevTools

**Module 01 · Beginner · Lesson 10 of 10**

## Learning objectives

- Use `console.log`, `console.table`, and `console.error` effectively
- Set breakpoints with the `debugger` statement and browser DevTools
- Read error messages and fix common beginner bugs

## Console output

```javascript
const users = [
  { id: 1, name: "Kim" },
  { id: 2, name: "Jordan" },
];

console.log("Debug:", users.length);
console.table(users);
console.warn("This is a warning");
console.error("This is an error message");
```

## The `debugger` keyword

Pauses execution when DevTools is open:

```javascript
function total(prices) {
  debugger; // execution stops here in DevTools
  return prices.reduce((sum, p) => sum + p, 0);
}

console.log(total([10, 20, 5]));
```

## Reading errors

| Error | Often means |
|-------|-------------|
| `ReferenceError: x is not defined` | Variable not declared |
| `TypeError: ... is not a function` | Wrong type or typo |
| `SyntaxError` | Missing bracket, quote, or comma |

Fix strategy: read the **line number**, check the **stack trace**, change one thing at a time.

## DevTools quick tour

1. **Console** — run snippets, see logs
2. **Sources** — breakpoints, step through code
3. **Network** — inspect fetch requests (Module 02)

## Exercise

1. Write a function with an intentional bug (e.g. wrong variable name).
2. Use `console.log` to trace values before the bug.
3. Fix it and confirm with a final log.

**Next:** Start [Module 02 — ES6+ features](../02-intermediate/01-es6-features.md)
