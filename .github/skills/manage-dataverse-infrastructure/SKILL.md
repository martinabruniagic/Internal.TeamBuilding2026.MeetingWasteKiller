---
name: manage-dataverse-infrastructure
description: Create or align Dataverse infrastructure projects for this DDD .NET style. Keep Domain business-agnostic, centralize Dataverse logical names and columns in Infrastructure\Models static metadata classes, preserve DataverseConfig + DataverseBaseRepository + Action Pattern validation, and use Mapster-only .Adapt<T>() mappings with resilient retry/batch behavior.
---

# Manage Dataverse Infrastructure

Create new Dataverse infrastructure or align an existing implementation with this repository's DDD .NET conventions. Domain stays business-focused and infrastructure-agnostic, while Infrastructure owns Dataverse SDK access, metadata, mapping, batching, and DI.

## When to Use This Skill

- Add Dataverse persistence to an existing DDD solution
- Create a new infrastructure project such as `Client.Project.Dataverse`
- Refactor an existing Dataverse project to match the repository conventions
- Standardize configuration, repository base behavior, mapping, retries, batching, and DI
- Keep Dataverse metadata and SDK details out of Domain and Business layers

## Target Structure

```text
src/
├── Domains/
│   └── Client.Project.Domain/
│       ├── Models/
│       │   └── <Entity>.cs
│       └── Repositories/
│           └── I<Entity>Repository.cs
└── Infrastructures/
    └── Client.Project.Dataverse/
        ├── Abstractions/
        │   └── DataverseBaseRepository.cs
        ├── Configurations/
        │   └── DataverseConfig.cs
        ├── Mappings/
        │   └── <Entity>MappingConfig.cs
        ├── Models/
        │   └── <Entity>DataverseModel.cs
        ├── Repositories/
        │   └── <Entity>Repository.cs
        └── ServiceCollectionExtensions.cs
```

## Architecture Rules

- Domain models must remain infrastructure-agnostic and business-facing
- Domain repository contracts must stay typed on Domain models, for example `IAccountRepository : IRepository<Account, Guid>`
- Do not place Dataverse entities, logical names, schema names, or column metadata in Domain
- `Infrastructure\Models\` must contain static metadata classes that centralize:
  - the Dataverse logical entity name
  - the primary id/logical key names when needed
  - every Dataverse column logical name used by repositories or mappings
- Mapping profiles/configuration must reference those metadata constants instead of hardcoded strings
- Keep Dataverse SDK types, queries, and request/response handling inside Infrastructure only

## Required Contracts

- Author Domain models manually in `Domain\Models\`
- Keep Domain repository contracts in `Domain\Repositories\`
- Each Domain repository contract must inherit `IRepository<TEntity, TKey>`
- Each concrete Dataverse repository must inherit `DataverseBaseRepository`
- Use `Microsoft.PowerPlatform.Dataverse.Client` directionally from Infrastructure only

## Configuration Rules

`DataverseConfig` must expose:

- `public const string SectionName = "Dataverse";`
- `EnvironmentUrl`
- `ClientId`
- `ClientSecret`
- `TenantId`
- `OnReadBatchSize`
- `OnWriteBatchSize`
- retry count (for example `RetryCount`)

Put all validation in `DataverseConfig.Validate()`. `ServiceCollectionExtensions` must instantiate the config, apply `configure(options)`, call `options.Validate()`, then register dependencies.

## Mapping Rules

- Mapping is strict: use Mapster only via `.Adapt<T>()`
- Do not use `IMapper`
- Do not write manual mapping code between Dataverse payloads and Domain models
- Register mapping configuration globally in DI before repositories are resolved
- Use the static metadata constants from `Infrastructure\Models\` inside mapping configuration when selecting or reading Dataverse attributes

## Batch Behavior

Mirror resilient SQL-style batching:

- accumulate logical per-record failures instead of stopping the whole batch
- retry timeout/connection/transient failures up to configured retry count
- return counts for total, success, failure, and retry
- include pagination token when the operation is paged

Keep retry orchestration and Dataverse execution helpers centralized in `DataverseBaseRepository`.

## DI Pattern

Use Action Pattern + validation:

```csharp
public static IServiceCollection AddDataverseInfrastructure(
    this IServiceCollection services,
    Action<DataverseConfig> configure)
{
    ArgumentNullException.ThrowIfNull(configure);

    var options = new DataverseConfig();
    configure(options);
    options.Validate();

    services.AddSingleton(options);
    services.AddMapster();
    services.AddScoped(_ => new ServiceClient(/* build from options */));
    services.AddScoped<IAccountRepository, AccountRepository>();

    return services;
}
```

## Workflow

1. Detect whether the target Dataverse infrastructure project already exists.
2. If it does not exist, create the project structure and required Dataverse assets; if it does exist, align the existing code with this skill before adding new behavior.
3. Create or align the Domain model manually in `Domain\Models\`.
4. Create or align the Domain repository contract so it inherits `IRepository<TEntity, TKey>` and stays typed on the Domain model.
5. Create or align `Configurations\DataverseConfig` with the required properties and `Validate()`.
6. Create or align `Abstractions\DataverseBaseRepository` for `ServiceClient`, retries, batching, and pagination helpers.
7. Create or align static metadata classes under `Infrastructure\Models\` so logical names and column names are centralized there.
8. Add or refactor Mapster mapping registrations under `Mappings\`, always consuming the metadata constants.
9. Create or align concrete repositories using `.Adapt<T>()` for every Domain/infrastructure translation.
10. Register config, Mapster, `ServiceClient`, and repositories in `ServiceCollectionExtensions`.

## Constraints

- Keep Domain models and repository contracts outside Infrastructure
- Keep Dataverse entities, metadata, SDK types, and queries inside Infrastructure
- Never hardcode environment URLs, client IDs, secrets, tenant IDs, logical names, or column names outside centralized metadata/configuration
- Do not use AutoMapper or custom/manual entity mapping
- Generate or align all required artifacts: Domain models, repository contracts, `DataverseConfig`, `DataverseBaseRepository`, static metadata models, concrete repositories, Mapster registration, and DI registration
