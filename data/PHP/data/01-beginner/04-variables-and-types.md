# Lesson 04 — Variables and Types

**Module 01 · Beginner · Lesson 04 of 10**


## Learning objectives

- Understand **variables and types** in PHP
- Read and write small examples you can run locally
- Connect this topic to the next lesson in the course

## Overview

Variables and Types is a core topic on the PolyCode **PHP Certificate Course** path. Work through the examples, then try the exercise before moving on.

## Key concepts

1. **Syntax and structure** — how PHP expresses this idea clearly
2. **Common patterns** — what you will see in real projects
3. **Mistakes to avoid** — typical beginner errors and fixes

## Example

```php
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

## Reference code

```
<?php
/**
 * PHP Variables and Data Types
 * 
 * Understanding variables, data types, and type conversion in PHP.
 */

// Variable Declaration and Assignment
echo "=== Variable Declaration and Assignment ===\n";

// Different ways to declare variables
$name = "John Doe";
$age = 25;
$height = 5.9;
$isStudent = true;
$courses = ["PHP", "JavaScript", "Python"];

echo "Name: $name\n";
echo "Age: $age\n";
echo "Height: $height\n";
echo "Is Student: " . ($isStudent ? 'Yes' : 'No') . "\n";
echo "Courses: " . implode(", ", $courses) . "\n\n";

// Variable Variables
echo "=== Variable Variables ===\n";

$variableName = "message";
$$variableName = "Hello, World!";

echo "Variable name: $variableName\n";
echo "Message: $message\n\n";

// Data Types
echo "=== Data Types ===\n";

// String
$stringVar = "This is a string";
echo "String: $stringVar (Type: " . gettype($stringVar) . ")\n";

// Integer
$intVar = 42;
echo "Integer: $intVar (Type: " . gettype($intVar) . ")\n";

// Float
$floatVar = 3.14159;
echo "Float: $floatVar (Type: " . gettype($floatVar) . ")\n";

// Boolean
$boolVar = true;
echo "Boolean: " . ($boolVar ? 'true' : 'false') . " (Type: " . gettype($boolVar) . ")\n";

// Array
$arrayVar = [1, 2, 3, 4, 5];
echo "Array: [" . implode(", ", $arrayVar) . "] (Type: " . gettype($arrayVar) . ")\n";

// Object
class Person {
    public $name = "Jane Doe";
    public $age = 30;
}

$objectVar = new Person();
echo "Object: " . get_class($objectVar) . " (Type: " . gettype($objectVar) . ")\n";

// NULL
$nullVar = null;
echo "NULL: " . ($nullVar ?? 'NULL') . " (Type: " . gettype($nullVar) . ")\n\n";

// Type Casting
echo "=== Type Casting ===\n";

// Implicit Type Conversion
$number = "10";
$result = $number + 5;
echo "String '10' + 5 = $result (Type: " . gettype($result) . ")\n";

// Explicit Type Casting
$stringValue = "123.45";
$intValue = (int)$stringValue;
$floatValue = (float)$stringValue;
$boolValue = (bool)$stringValue;

echo "Original string: $stringValue\n";
echo "Integer cast: $intValue\n";
echo "Float cast: $floatValue\n";
echo "Boolean cast: " . ($boolValue ? 'true' : 'false') . "\n\n";

// Type Checking Functions
echo "=== Type Checking Functions ===\n";

$testValue = "Hello World";

echo "Value: $testValue\n";
echo "is_string(): " . (is_string($testValue) ? 'true' : 'false') . "\n";
echo "is_int(): " . (is_int($testValue) ? 'true' : 'false') . "\n";
echo "is_float(): " . (is_float($testValue) ? 'true' : 'false') . "\n";
echo "is_bool(): " . (is_bool($testValue) ? 'true' : 'false') . "\n";
echo "is_array(): " . (is_array($testValue) ? 'true' : 'false') . "\n";
echo "is_object(): " . (is_object($testValue) ? 'true' : 'false') . "\n";
echo "is_null(): " . (is_null($testValue) ? 'true' : 'false') . "\n\n";

// Constants
echo "=== Constants ===\n";

// Define constants
define("SITE_NAME", "My PHP Website");
define("MAX_USERS", 1000);
define("PI", 3.14159);

echo "Site Name: " . SITE_NAME . "\n";
echo "Max Users: " . MAX_USERS . "\n";
echo "PI: " . PI . "\n\n";

// Magic Constants
echo "=== Magic Constants ===\n";

echo "__FILE__: " . __FILE__ . "\n";
echo "__LINE__: " . __LINE__ . "\n";
echo "__DIR__: " . __DIR__ . "\n";
echo "__FUNCTION__: " . __FUNCTION__ . "\n";
echo "__CLASS__: " . __CLASS__ . "\n";
echo "__METHOD__: " . __METHOD__ . "\n";
echo "__NAMESPACE__: " . __NAMESPACE__ . "\n\n";

// Variable Scope
echo "=== Variable Scope ===\n";

$globalVar = "Global variable";

function testScope() {
    $localVar = "Local variable";
    global $globalVar;
    $globalVar = "Modified global variable";
    
    echo "Local variable: $localVar\n";
    echo "Global variable inside function: $globalVar\n";
}

testScope();
echo "Global variable outside function: $globalVar\n\n";

// Static Variables
echo "=== Static Variables ===\n";

function counter() {
    static $count = 0;
    $count++;
    echo "Count: $count\n";
}

counter(); // Count: 1
counter(); // Count: 2
counter(); // Count: 3
echo "\n";

// Reference Variables
echo "=== Reference Variables ===\n";

$original = "Original value";
$reference = &$original;

echo "Original: $original\n";
echo "Reference: $reference\n";

$reference = "Modified value";

echo "After modification:\n";
echo "Original: $original\n";
echo "Reference: $reference\n\n";

// Variable Dumping and Debugging
echo "=== Variable Dumping and Debugging ===\n";

$debugVar = [
    'name' => 'John',
    'age' => 25,
    'skills' => ['PHP', 'MySQL', 'JavaScript']
];

echo "print_r():\n";
print_r($debugVar);

echo "\nvar_dump():\n";
var_dump($debugVar);

echo "\nvar_export():\n";
var_export($debugVar);

echo "\n\n";

// Practical Examples
echo "=== Practical Examples ===\n";

// Example 1: User Profile
function createUserProfile($name, $age, $email, $isActive = true) {
    return [
        'name' => $name,
        'age' => (int)$age,
        'email' => $email,
        'is_active' => (bool)$isActive,
        'created_at' => date('Y-m-d H:i:s')
    ];
}

$user = createUserProfile("Alice Johnson", 28, "alice@example.com");
echo "User Profile:\n";
foreach ($user as $key => $value) {
    echo "  $key: $value\n";
}
echo "\n";

// Example 2: Calculator
function calculate($operation, $num1, $num2) {
    $num1 = (float)$num1;
    $num2 = (float)$num2;
    
    switch ($operation) {
        case 'add':
            return $num1 + $num2;
        case 'subtract':
            return $num1 - $num2;
        case 'multiply':
            return $num1 * $num2;
        case 'divide':
            return $num2 != 0 ? $num1 / $num2 : "Cannot divide by zero";
        default:
            return "Invalid operation";
    }
}

echo "Calculator Examples:\n";
echo "10 + 5 = " . calculate('add', 10, 5) . "\n";
echo "10 - 5 = " . calculate('subtract', 10, 5) . "\n";
echo "10 * 5 = " . calculate('multiply', 10, 5) . "\n";
echo "10 / 5 = " . calculate('divide', 10, 5) . "\n\n";

// Example 3: Data Validation
function validateUserData($data) {
    $errors = [];
    
    // Validate name (required, string)
    if (!isset($data['name']) || empty($data['name'])) {
        $errors[] = "Name is required";
    } elseif (!is_string($data['name'])) {
        $errors[] = "Name must be a string";
    }
    
    // Validate age (required, integer, positive)
    if (!isset($data['age']) || $data['age'] === '') {
        $errors[] = "Age is required";
    } elseif (!is_numeric($data['age'])) {
        $errors[] = "Age must be a number";
    } elseif ((int)$data['age'] <= 0) {
        $errors[] = "Age must be positive";
    }
    
    // Validate email (required, valid format)
    if (!isset($data['email']) || empty($data['email'])) {
        $errors[] = "Email is required";
    } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format";
    }
    
    return $errors;
}

$testData = [
    'name' => 'Bob Smith',
    'age' => '35',
    'email' => 'bob@example.com'
];

$validationErrors = validateUserData($testData);

if (empty($validationErrors)) {
    echo "Data validation passed!\n";
} else {
    echo "Validation errors:\n";
    foreach ($validationErrors as $error) {
        echo "  - $error\n";
    }
}

echo "\n=== End of Variables and Data Types ===\n";
?>
```
