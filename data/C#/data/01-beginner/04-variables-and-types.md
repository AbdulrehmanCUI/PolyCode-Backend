# Lesson 04 — Variables and Types

**Module 01 · Beginner · Lesson 04 of 10**


## Learning objectives

- Understand **variables and types** in C#
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Variables and Types is a core topic on the PolyCode **C# Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how C# expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```csharp
// Variables and Types — practice sketch
// declare and print sample variables
```

## Exercise

1. Write a short program that uses today's topic.
2. Change one value and predict the output before running.
3. Explain the result in your own words (2–3 sentences).

## Checkpoint

You are ready for the next lesson when you can solve the exercise without copying the example.

---

**Next:** Continue to lesson 05 in this module.

---

## Additional reference

# Variables in C#

Variables are containers for storing data values. In C#, you must declare a variable before using it.

## Declaration and Initialization

```csharp
// Declaration
int age;
string name;
double salary;
bool isActive;

// Initialization
age = 25;
name = "John Doe";
salary = 50000.50;
isActive = true;

// Declaration and initialization in one line
int score = 100;
string city = "New York";
```

## Data Types

### Value Types
- `int` - Whole numbers (-2,147,483,648 to 2,147,483,647)
- `double` - Floating-point numbers (64-bit)
- `float` - Floating-point numbers (32-bit)
- `decimal` - Precise decimal numbers (128-bit)
- `bool` - Boolean values (true/false)
- `char` - Single character
- `DateTime` - Date and time values

### Reference Types
- `string` - Text values
- `object` - Base type for all types
- Arrays, Classes, and more

## Variable Naming Rules

1. Must start with a letter or underscore
2. Can contain letters, numbers, and underscores
3. Cannot use C# keywords
4. Use camelCase for local variables
5. Use PascalCase for public properties

## Constants

Use `const` for variables that never change:

```csharp
const double PI = 3.14159;
const int MAX_ATTEMPTS = 3;
```

## Best Practices

- Choose meaningful names
- Initialize variables when possible
- Use appropriate data types
- Keep variable scope as small as possible
