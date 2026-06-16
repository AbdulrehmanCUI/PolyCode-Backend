# Lesson 07 — JSON and REST APIs

**Module 02 · Intermediate · Lesson 7 of 7**

## Learning objectives

- Serialize JavaScript objects to JSON strings
- Parse JSON safely and validate shape
- Understand REST verbs: GET, POST, PUT, DELETE

## JSON in JavaScript

```javascript
const course = { id: "js-101", title: "JavaScript", modules: 5 };

const json = JSON.stringify(course, null, 2);
console.log(json);

const copy = JSON.parse(json);
console.log(copy.title);
```

## Safe parsing

```javascript
function parseJsonSafe(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch {
    return { ok: false, data: null };
  }
}
```

## REST overview

| Method | Typical use |
|--------|-------------|
| GET | Read resource |
| POST | Create resource |
| PUT/PATCH | Update resource |
| DELETE | Remove resource |

URLs name **resources** (`/users/1`, `/posts`). Status `200` = OK, `201` = created, `404` = not found.

## Mini project

Combine with [Fetch API](06-fetch-api.md):

1. GET a list of items from JSONPlaceholder
2. Display titles in the console
3. POST a new item and log the fake `id` returned

**Next:** [Module 03 — Closures and scope](../03-advanced/01-closures-and-scope.md)
