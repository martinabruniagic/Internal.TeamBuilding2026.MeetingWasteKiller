variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
}

variable "location" {
  type        = string
  description = "Azure region for all resources (except the Static Web App, which is always westeurope)"
  default     = "italynorth"
}

variable "app_name" {
  type        = string
  description = "Base name used for all resource names"
  default     = "meeting-waste-killer"
}

variable "environment" {
  type        = string
  description = "Deployment environment label, embedded in every resource name"
  default     = "prod"

  validation {
    condition     = contains(["prod", "staging", "dev"], var.environment)
    error_message = "environment must be one of: prod, staging, dev."
  }
}

variable "sql_admin_username" {
  type        = string
  description = "SQL Server administrator login name"
  default     = "sqladmin"
}

variable "sql_admin_password" {
  type        = string
  description = "SQL Server administrator password (min 16 chars, must satisfy Azure complexity)"
  sensitive   = true

  validation {
    condition     = length(var.sql_admin_password) >= 16
    error_message = "sql_admin_password must be at least 16 characters."
  }
}

variable "jwt_key" {
  type        = string
  description = "JWT signing key used by the API — must be at least 32 characters"
  sensitive   = true

  validation {
    condition     = length(var.jwt_key) >= 32
    error_message = "jwt_key must be at least 32 characters."
  }
}

variable "tf_state_storage_account" {
  type        = string
  description = "Name of the pre-existing Azure Storage Account that holds Terraform remote state"

  validation {
    condition     = can(regex("^[a-z0-9]{3,24}$", var.tf_state_storage_account))
    error_message = "tf_state_storage_account must be 3-24 lowercase alphanumeric characters."
  }
}

variable "tags" {
  type        = map(string)
  description = "Additional tags merged into the common_tags applied to every resource"
  default     = {}
}
