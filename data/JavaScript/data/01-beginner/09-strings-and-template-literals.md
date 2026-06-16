# Lesson 09 — Strings and Template Literals

**Module 01 · Beginner · Lesson 9 of 10**

## Learning objectives

- Create and combine strings with `+`, template literals, and common methods
- Use `length`, `includes`, `slice`, and `toLowerCase` / `toUpperCase`
- Format dynamic messages for user interfaces and logs

## Strings in JavaScript

Strings hold text. Use **single quotes**, **double quotes**, or **backticks** for template literals.

```javascript
const single = 'Hello';
const double = "World";
const template = `Hello, ${double}!`; // template literal
console.log(template);
```

## Template literals (recommended)

Backticks let you embed expressions with `${ ... }`:

```javascript
const name = "Aisha";
const score = 92;
console.log(`${name} scored ${score}%`);
console.log(`Next lesson: ${score >= 70 ? "intermediate" : "review"}`);
```

Multi-line strings are easy:

```javascript
const card = `
  Student: ${name}
  Status: Passed
`;
console.log(card);
```

## Useful string methods

```javascript
const email = "Student@Example.COM";

console.log(email.toLowerCase());        // student@example.com
console.log(email.includes("@"));        // true
console.log(email.slice(0, 7));          // Student
console.log(email.replace("Example", "PolyCode"));
console.log("  trim me  ".trim());
```

## Escape characters

```javascript
console.log("Line one\nLine two");
console.log('She said "Hello"');
console.log("Path: C:\\Users\\dev");
```

## Exercise

1. Store your name and favorite language in variables.
2. Print a one-line bio using a template literal.
3. Check if a variable contains the substring `"Code"` (case-insensitive).

**Next:** [Lesson 10 — Debugging and DevTools](10-debugging-and-devtools.md)
