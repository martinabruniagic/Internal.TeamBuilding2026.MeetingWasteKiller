resource "azurerm_mssql_server" "sql" {
  name                         = "sql-${local.prefix}"
  resource_group_name          = data.azurerm_resource_group.rg.name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
  minimum_tls_version          = "1.2"

  tags = local.common_tags
}

resource "azurerm_mssql_database" "db" {
  name                 = "sqldb-${local.prefix}"
  server_id            = azurerm_mssql_server.sql.id
  sku_name             = "S0"
  storage_account_type = "Local" # Italy North non supporta geo-redundant storage su S0

  tags = local.common_tags
}

# Allow all Azure-hosted services (including App Service) to reach this SQL Server.
# The 0.0.0.0 → 0.0.0.0 range is the Azure-standard "Allow Azure services" sentinel.
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
