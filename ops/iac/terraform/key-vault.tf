resource "azurerm_key_vault" "kv" {
  name                       = "kv-mwk-${var.environment}"
  resource_group_name        = data.azurerm_resource_group.rg.name
  location                   = var.location
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  enable_rbac_authorization  = true
  soft_delete_retention_days = 7
  purge_protection_enabled   = true

  tags = local.common_tags
}

# Terraform runner (local user on bootstrap, CI/CD SP on subsequent runs) gets
# full admin access to create and rotate secrets.
# This covers both cases: data.azurerm_client_config.current returns the local user
# when running locally, and the CI/CD SP when running in GitHub Actions.
resource "azurerm_role_assignment" "kv_admin_current" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

# Azure RBAC propagation can take up to 5 minutes — wait before writing secrets
resource "time_sleep" "kv_rbac_propagation" {
  create_duration = "90s"
  depends_on      = [azurerm_role_assignment.kv_admin_current]
}

# App Service Managed Identity gets read-only access to secrets
resource "azurerm_role_assignment" "kv_secrets_app_service" {
  scope                            = azurerm_key_vault.kv.id
  role_definition_name             = "Key Vault Secrets User"
  principal_id                     = azurerm_linux_web_app.api.identity[0].principal_id
  skip_service_principal_aad_check = true
}

# SQL connection string — built from SQL Server outputs; value is sensitive in state
resource "azurerm_key_vault_secret" "sql_connection_string" {
  name         = "sql-connection-string"
  key_vault_id = azurerm_key_vault.kv.id
  value = join("", [
    "Server=tcp:${azurerm_mssql_server.sql.fully_qualified_domain_name},1433;",
    "Initial Catalog=${azurerm_mssql_database.db.name};",
    "Persist Security Info=False;",
    "User ID=${var.sql_admin_username};",
    "Password=${var.sql_admin_password};",
    "MultipleActiveResultSets=False;",
    "Encrypt=True;",
    "TrustServerCertificate=False;",
    "Connection Timeout=30;"
  ])

  # Wait for RBAC propagation before writing secrets
  depends_on = [time_sleep.kv_rbac_propagation]

  tags = local.common_tags
}

# JWT signing key read by the API at runtime via Key Vault reference
resource "azurerm_key_vault_secret" "jwt_key" {
  name         = "jwt-key"
  key_vault_id = azurerm_key_vault.kv.id
  value        = var.jwt_key

  depends_on = [time_sleep.kv_rbac_propagation]

  tags = local.common_tags
}

# Static Web App deployment token — read by the CI/CD workflow to deploy the frontend
resource "azurerm_key_vault_secret" "swa_deployment_token" {
  name         = "swa-deployment-token"
  key_vault_id = azurerm_key_vault.kv.id
  value        = azurerm_static_web_app.swa.api_key

  depends_on = [time_sleep.kv_rbac_propagation]

  tags = local.common_tags
}
