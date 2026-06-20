# Static Web App — location is fixed to westeurope (Azure constraint for SWA in Europe)
# NEXT_PUBLIC_API_URL is NOT set here to avoid a circular dependency with the App Service.
# It is injected as a build-time env var by the deploy-frontend CI job.
resource "azurerm_static_web_app" "swa" {
  name                = "swa-${local.prefix}"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = "westeurope"
  sku_tier            = "Standard"
  sku_size            = "Standard"

  tags = local.common_tags
}
