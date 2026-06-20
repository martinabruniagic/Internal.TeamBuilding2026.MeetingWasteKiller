output "app_service_name" {
  value       = azurerm_linux_web_app.api.name
  description = "App Service resource name (used in az webapp deploy)"
}

output "app_service_hostname" {
  value       = azurerm_linux_web_app.api.default_hostname
  description = "Default hostname of the App Service, without the https:// scheme"
}

output "app_service_url" {
  value       = "https://${azurerm_linux_web_app.api.default_hostname}"
  description = "Full HTTPS URL of the .NET API"
}

output "static_web_app_url" {
  value       = "https://${azurerm_static_web_app.swa.default_host_name}"
  description = "Full HTTPS URL of the Static Web App (Next.js frontend)"
}

output "key_vault_name" {
  value       = azurerm_key_vault.kv.name
  description = "Key Vault name — used by CI to read the SWA deployment token"
}

output "sql_server_fqdn" {
  value       = azurerm_mssql_server.sql.fully_qualified_domain_name
  description = "Fully-qualified domain name of the Azure SQL Server"
}

output "sql_server_name" {
  value       = azurerm_mssql_server.sql.name
  description = "Azure SQL Server resource name — used by CI to open/close the migration firewall rule"
}

output "app_service_principal_id" {
  value       = azurerm_linux_web_app.api.identity[0].principal_id
  description = "Object ID of the App Service System-Assigned Managed Identity"
}

output "resource_group_name" {
  value       = data.azurerm_resource_group.rg.name
  description = "Resource group that owns all deployed resources"
}
