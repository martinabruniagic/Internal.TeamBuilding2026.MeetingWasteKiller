# Read the pre-existing resource group — never recreated by Terraform
data "azurerm_resource_group" "rg" {
  name = "rg-blue"
}

# Current caller identity — used for Key Vault RBAC and as App Registration owner
data "azurerm_client_config" "current" {}

locals {
  prefix = "${var.app_name}-${var.environment}"

  common_tags = merge(var.tags, {
    Application = var.app_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Repository  = "martinabruniagic/Internal.TeamBuilding2026.MeetingWasteKiller"
  })
}
