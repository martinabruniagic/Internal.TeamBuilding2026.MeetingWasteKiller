---
name: manage-azure-service-bus-infrastructure
description: Create or align publisher-only Azure Service Bus infrastructure in this DDD .NET style. Manage the domain publisher abstraction, Client.Project.AzureServiceBus project, AzureServiceBusConfig, AzureServiceBusBasePublisher, one concrete publisher per queue, and DI registration with Action Pattern + Validate(). Do not scaffold consumers.
---

# Manage Azure Service Bus Infrastructure

Manage a **publisher-only** Azure Service Bus infrastructure project aligned with this repository's DDD .NET conventions. This skill supports both creating a new infrastructure project and refactoring an existing one so publishers, configuration, and DI stay consistent. **Do not scaffold consumers** here — consumers remain Azure Functions projects.

## When to Use This Skill

- Creating a new `Client.Project.AzureServiceBus` infrastructure project
- Aligning an existing Azure Service Bus publisher project to the expected naming and structure
- Introducing or refining a domain-level generic publisher abstraction
- Standardizing Azure Service Bus configuration, base publisher logic, and DI registration
- Adding one concrete publisher per queue without leaking Azure SDK details outside Infrastructure

## Target Structure

```text
src/
├── Domains/
│   └── Client.Project.Domain/
│       └── Common/
│           └── Interfaces/
│               ├── IPublisher<TMessage>.cs
│               └── I<Feature>Publisher.cs
└── Infrastructures/
    └── Client.Project.AzureServiceBus/
        ├── Abstractions/
        │   └── AzureServiceBusBasePublisher.cs
        ├── Configurations/
        │   └── AzureServiceBusConfig.cs
        ├── Publishers/
        │   ├── <QueueName>Publisher.cs
        │   └── <AnotherQueueName>Publisher.cs
        └── ServiceCollectionExtensions.cs
```

## Naming Guidance

- Infrastructure project name: `Client.Project.AzureServiceBus`
- Configuration type: `AzureServiceBusConfig`
- Shared base publisher: `AzureServiceBusBasePublisher`
- Domain should expose a generic publisher abstraction such as `IPublisher<TMessage>`
- More specific publisher contracts can inherit from the generic abstraction when domain intent must be explicit
- Create exactly one concrete publisher per queue
- Keep one type per file and use file-scoped namespaces
- Put domain contracts in Domain and Azure SDK details in Infrastructure

## Required Contracts

### Domain

Expose a generic publisher abstraction such as:

```csharp
public interface IPublisher<in TMessage>
{
    Task PublishAsync(
        TMessage message,
        CancellationToken cancellationToken = default);
}
```

When a feature needs a dedicated contract, inherit from the generic abstraction instead of duplicating publishing semantics:

```csharp
public interface IOrderCreatedPublisher : IPublisher<OrderCreatedMessage>;
```

Keep Domain focused on publishing only. Do not couple the abstraction to Azure SDK types.

### Infrastructure

Always include:

- `Configurations/AzureServiceBusConfig`
- `Abstractions/AzureServiceBusBasePublisher`
- One concrete publisher implementation per queue under `Publishers/`
- `ServiceCollectionExtensions`

## Configuration Rules

- Use `AzureServiceBusConfig` with a `Validate()` method
- Keep queue names and namespace settings in configuration, not hardcoded in publishers
- Register infrastructure with the Action Pattern, for example:

```csharp
services.AddAzureServiceBusInfrastructure(options =>
{
    options.FullyQualifiedNamespace = "...";
});
```

- `ServiceCollectionExtensions` must:
  1. instantiate `AzureServiceBusConfig`
  2. apply `configure(options)`
  3. call `options.Validate()`
  4. register the config, Azure client dependencies, and publishers

Do **not** duplicate validation logic inside `ServiceCollectionExtensions`.

## Publisher Rules

- Keep this skill strictly publisher-only
- Consumers remain Azure Functions and must not be scaffolded here
- Create one concrete publisher per queue
- Use specific publisher contracts only when the domain needs explicit intent
- Keep queue selection/configuration outside Domain and outside message models
- Centralize Azure Service Bus send logic in `AzureServiceBusBasePublisher`

## Security Rules

- Never hardcode connection strings, SAS keys, queue names, topic names, or namespace values
- Load secrets from configuration sources appropriate to the app: environment variables, user secrets, Key Vault, or secure host configuration

## Implementation Workflow

1. Detect whether the infrastructure project `Client.Project.AzureServiceBus` already exists.
2. If the project does not exist, create the project structure; if it does exist, align naming, contracts, configuration, and registrations with this skill.
3. Create or update the Domain generic publisher abstraction such as `IPublisher<TMessage>`.
4. Add or align any specific publisher interfaces so they inherit from the generic abstraction when needed.
5. Create or update `Configurations\AzureServiceBusConfig.cs` with required properties and `Validate()`.
6. Create or update `Abstractions\AzureServiceBusBasePublisher.cs` to centralize Azure Service Bus send logic.
7. Add or align one concrete publisher per queue under `Publishers\`.
8. Add or update `ServiceCollectionExtensions.cs` using Action Pattern + `Validate()`.
9. Register Azure Service Bus client dependencies without embedding secrets.

## Constraints

### MUST DO

- Support both new project creation and existing project alignment
- Keep publishers only in scope
- Keep publishing abstractions in Domain
- Use `Client.Project.AzureServiceBus`, `AzureServiceBusConfig`, and `AzureServiceBusBasePublisher`
- Use `ServiceCollectionExtensions` with Action Pattern
- Put validation in `AzureServiceBusConfig.Validate()`
- Keep one concrete publisher per queue

### MUST NOT DO

- Do not scaffold message consumers
- Do not put Azure Function triggers in this project
- Do not hardcode secrets or transport names
- Do not couple the Domain contract to Azure SDK types
