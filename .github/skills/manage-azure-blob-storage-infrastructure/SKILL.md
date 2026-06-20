---
name: manage-azure-blob-storage-infrastructure
description: Create or align Azure Blob Storage infrastructure projects for DDD-style .NET solutions using Azure.Storage.Blobs. Manage IBlobRepository contracts, AzureBlobStorageConfig, AzureBlobBaseStorage, AzureBlob<Feature>Storage, and DI registration with Action Pattern validation.
---

# Manage Azure Blob Storage Infrastructure

Create or refine Azure Blob Storage integrations for this DDD .NET style with a domain contract in Domain and an implementation project in Infrastructure. Use the Azure SDK directly via `Azure.Storage.Blobs`.

## When to Use This Skill

- Add Azure Blob Storage support to an existing DDD solution
- Create a new infrastructure project such as `Client.Project.AzureBlobStorage`
- Align an existing blob infrastructure project with the expected naming and DI conventions
- Standardize blob repository contracts, configuration, base abstractions, and DI registration
- Generate upload/download/delete/list persistence abstractions without leaking SDK details into Domain or Business

## Target Structure

```text
src/
├── Domains/
│   └── Client.Project.Domain/
│       └── Repositories/
│           └── IBlobRepository.cs
└── Infrastructures/
    └── Client.Project.AzureBlobStorage/
        ├── Abstractions/
        │   └── AzureBlobBaseStorage.cs
        ├── Configurations/
        │   └── AzureBlobStorageConfig.cs
        ├── Repositories/
        │   └── AzureBlob<Feature>Storage.cs
        └── ServiceCollectionExtensions.cs
```

## Naming Conventions

- **Domain contract**: `IBlobRepository`
- **Infrastructure project**: `Client.Project.AzureBlobStorage`
- **Configuration model**: `AzureBlobStorageConfig`
- **Shared base class**: `AzureBlobBaseStorage`
- **Concrete implementation**: `AzureBlob<Feature>Storage`
- **DI entry point**: `ServiceCollectionExtensions`

## Workflow

1. Detect whether the infrastructure project `Client.Project.AzureBlobStorage` already exists.
2. If the project does not exist, create it with `Configurations\AzureBlobStorageConfig.cs`, `Abstractions\AzureBlobBaseStorage.cs`, `Repositories\AzureBlob<Feature>Storage.cs`, and `ServiceCollectionExtensions.cs`.
3. If the project already exists, align its project name, folders, types, and DI entry point with this skill instead of creating duplicate assets.
4. Create or align `IBlobRepository` in Domain with only business-facing operations.
5. Create or align `AzureBlobStorageConfig` in `Configurations\` with a static section name and a `Validate()` method.
6. Create or align `AzureBlobBaseStorage` in `Abstractions\` to centralize `BlobServiceClient`, container resolution, and shared blob operations.
7. Create or align the concrete implementation `AzureBlob<Feature>Storage` inheriting from `AzureBlobBaseStorage` and implementing `IBlobRepository`.
8. Create or align `ServiceCollectionExtensions` to register configuration, `BlobServiceClient`, and repository implementations through Action Pattern + `Validate()`.

## Configuration Guidance

- Use a static section name, for example `public const string SectionName = "AzureBlobStorage";`
- Keep blob-specific settings in `AzureBlobStorageConfig`, such as:
  - `ConnectionString`
  - `DefaultContainerName`
  - named container settings when multiple containers are required
  - endpoint/account settings if connection string is not used
- Put validation rules in `AzureBlobStorageConfig.Validate()`, not in `ServiceCollectionExtensions`
- Never hardcode secrets; load them from configuration, user secrets, or secure environment-specific providers

## DI Pattern

Use `ServiceCollectionExtensions` with Action Pattern and validation:

```csharp
namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAzureBlobStorageInfrastructure(
        this IServiceCollection services,
        Action<AzureBlobStorageConfig> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        var options = new AzureBlobStorageConfig();
        configure(options);
        options.Validate();

        services.AddSingleton(options);
        services.AddSingleton(_ => new BlobServiceClient(options.ConnectionString));
        services.AddSingleton<IBlobRepository, AzureBlobFeatureStorage>();

        return services;
    }
}
```

## Constraints

- Use `Azure.Storage.Blobs`, not custom HTTP wrappers
- Keep the contract in Domain and the Azure SDK usage in Infrastructure
- Reuse container and client creation logic in `AzureBlobBaseStorage`
- Avoid hardcoded container names outside configuration
- Detect first whether blob infrastructure already exists, then either create missing assets or align the existing implementation
- Generate or align all required artifacts: `IBlobRepository`, `AzureBlobStorageConfig`, `AzureBlobBaseStorage`, `AzureBlob<Feature>Storage`, and DI registration
