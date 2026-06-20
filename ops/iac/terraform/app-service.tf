resource "azurerm_service_plan" "asp" {
  name                = "asp-${local.prefix}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"

  tags = local.common_tags
}

resource "azurerm_linux_web_app" "api" {
  name                = "app-${local.prefix}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.asp.id
  https_only          = true

  # System-Assigned Managed Identity used to resolve Key Vault references
  identity {
    type = "SystemAssigned"
  }

  site_config {
    always_on = true

    application_stack {
      # Adjust if provider version does not yet ship .NET 10 runtime alias
      dotnet_version = "10.0"
    }
  }

  app_settings = {
    ASPNETCORE_ENVIRONMENT       = "Production"
    "Jwt__Issuer"                = "MeetingWasteKiller"
    "Jwt__Audience"              = "MeetingWasteKillerClient"
    "Jwt__ExpiryHours"           = "8"
    "WasteScore__AlertThreshold" = "60"
    # CORS via app setting — avoids azurerm provider bug with computed values in cors blocks
    "WEBSITE_CORS_ALLOWED_ORIGINS"     = "https://${azurerm_static_web_app.swa.default_host_name}"
    "WEBSITE_CORS_SUPPORT_CREDENTIALS" = "false"
    # Sensitive values resolved at runtime via Key Vault references — never stored in plain text
    "Jwt__Key" = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.kv.name};SecretName=jwt-key)"
  }

  # .NET reads this as Configuration.GetConnectionString("Default")
  connection_string {
    name  = "Default"
    type  = "SQLServer"
    value = "@Microsoft.KeyVault(VaultName=${azurerm_key_vault.kv.name};SecretName=sql-connection-string)"
  }

  tags = local.common_tags
}
