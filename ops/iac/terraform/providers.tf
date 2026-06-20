terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {
    key_vault {
      # Keep soft-deleted vaults so accidental destroys are recoverable
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
  }
  subscription_id = var.subscription_id
  # Auth: az login (local) or ARM_USE_OIDC=true + ARM_CLIENT_ID/TENANT_ID/SUBSCRIPTION_ID (CI)
}

provider "azuread" {
  # Inherits tenant from azurerm; no extra config needed for OIDC
}
