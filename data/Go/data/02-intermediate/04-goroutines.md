# Lesson 04 — Goroutines

**Module 02 · Intermediate · Lesson 04 of 06**


## Learning objectives

- Understand **goroutines** in Go
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Goroutines is a core topic on the PolyCode **Go Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how Go expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```go
// Goroutines — practice sketch
// add your code here
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 05 in this module.
\n\n# Lesson 8: Concurrency with Goroutines

## What is Concurrency?

Concurrency is about dealing with multiple things at once. Go makes concurrency easy with goroutines.

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime. They're cheap to create and manage.

## Starting a Goroutine

Use the `go` keyword to start a goroutine:
```go
go functionName()
```

## Anonymous Goroutines

You can also start goroutines with anonymous functions:
```go
go func() {
    // code to run concurrently
}()
```

## Goroutine Characteristics

- Goroutines are extremely lightweight (starts with 2KB stack)
- They're scheduled by the Go runtime, not the OS
- They communicate through channels, not shared memory
- Multiple goroutines can run on a single OS thread

## Main Function

The main function is itself a goroutine. When main exits, all other goroutines are terminated.

## Waiting for Goroutines

Use `sync.WaitGroup` to wait for goroutines to complete:
```go
var wg sync.WaitGroup

wg.Add(1) // increment counter
go func() {
    defer wg.Done() // decrement counter
    // do work
}()
wg.Wait() // wait for counter to reach 0
```

## Common Patterns

### Worker Pool Pattern
Multiple goroutines processing work from a queue.

### Pipeline Pattern
Data flows through a series of goroutines, each performing a transformation.

### Fan-in/Fan-out Pattern
Distribute work to multiple goroutines (fan-out) and collect results (fan-in).

## Best Practices

- Don't create too many goroutines
- Use channels for communication between goroutines
- Always handle goroutine cleanup
- Be careful with shared data - use mutexes or channels

## Practice

- Run `go run ./examples/08-concurrency-goroutines`
- Experiment with different numbers of goroutines
- Try implementing a simple worker pool
