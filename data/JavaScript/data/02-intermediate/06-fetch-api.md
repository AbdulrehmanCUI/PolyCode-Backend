# Lesson 06 — Fetch API

**Module 02 · Intermediate · Lesson 6 of 7**

## Learning objectives

- Request data from a URL with `fetch`
- Handle HTTP status codes and JSON responses
- Use `async`/`await` for readable network code

## Basic GET request

```javascript
fetch("https://jsonplaceholder.typicode.com/users/1")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((user) => console.log(user.name))
  .catch((err) => console.error("Failed:", err.message));
```

## With async/await

```javascript
async function loadPost(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
  );
  if (!response.ok) throw new Error("Request failed");
  const post = await response.json();
  return post;
}

loadPost(1).then((p) => console.log(p.title));
```

## POST JSON

```javascript
async function createPost() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hello", body: "From PolyCode", userId: 1 }),
    },
  );
  return response.json();
}
```

## Exercise

Build a function `getWeather(city)` that calls a public API (or mock JSON) and returns the temperature field. Handle errors with `try/catch`.

**Next:** [Lesson 07 — JSON and REST APIs](07-json-and-apis.md)
