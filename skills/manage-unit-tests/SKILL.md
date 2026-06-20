---
name: manage-unit-tests
description: Create or evolve unit tests for DDD-style .NET services using xUnit, FluentAssertions, and NSubstitute. Use for test project setup, aligning existing DI-based test assets, extending service coverage, and keeping test suites parameterized with Theory-first patterns.
---

# Manage Unit Tests

Create or refine concise, maintainable unit tests for this DDD-style .NET codebase.

## Stack

- xUnit
- FluentAssertions
- NSubstitute

## What to Create or Align

1. A test project, when missing, with `Startup.cs` that builds DI and registers the application with `AddBusiness(...)`, `AddInfrastructure(...)`, and other required service registrations.
2. `BaseTest.cs` with a protected `_serviceProvider` initialized from the test startup.
3. Test classes inheriting from `BaseTest`, either newly created or aligned with the existing structure.
4. Test methods for every public method exposed by the target service interface, preferring reusable Theory-based coverage.

## Rules

- When testing services, resolve them through DI from `_serviceProvider`; do not manually construct the service under test.
- Use NSubstitute to mock external dependencies and collaborators that should not execute real behavior.
- Default to `[Theory]` with `[InlineData(...)]` whenever the behavior can be meaningfully parameterized.
- Use `[Fact]` only when no meaningful parameterization exists.
- Generate or align a test stub for each public interface method, even if the assertions are still TODO-level placeholders.
- Name tests with `MethodName_WhenCondition_ExpectedBehavior`.
- Keep tests focused on behavior, with clear arrange/act/assert structure.

## Workflow

1. Detect whether the target test project, `Startup.cs`, `BaseTest.cs`, and service test classes already exist.
2. If the assets do not exist, create them with the required DI-based structure; if they do exist, align them with the conventions in this skill before adding coverage.
3. Identify the target service interface and list all its public methods.
4. Create or update the test class inheriting from `BaseTest`, resolving services through `_serviceProvider`.
5. Add or refactor one test per public interface method, preferring `[Theory]` + `[InlineData(...)]` for scenario coverage and using `[Fact]` only when parameterization adds no value.
6. Substitute external dependencies with NSubstitute and assert outcomes with FluentAssertions.

## Output Expectations

- Test project bootstrapped through DI.
- Shared `BaseTest` infrastructure in place.
- Service tests resolved from `_serviceProvider`.
- Existing test assets aligned when present, or new ones created when absent.
- Full public interface coverage with Theory-first test stubs ready to implement.
