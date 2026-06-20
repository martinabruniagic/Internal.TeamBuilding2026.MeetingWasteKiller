terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.12"
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
  # Auth: az login (local) or ARM_CLIENT_ID/SECRET/TENANT_ID/SUBSCRIPTION_ID (CI)
}
