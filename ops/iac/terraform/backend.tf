terraform {
  backend "azurerm" {
    resource_group_name = "rg-blue"
    container_name      = "tfstate"
    key                 = "prod/meeting-waste-killer.tfstate"
    # storage_account_name is injected at init time:
    #   terraform init -backend-config="storage_account_name=<name>"
    # In CI the workflow passes: -backend-config="storage_account_name=${{ secrets.TF_STATE_STORAGE_ACCOUNT }}"
    # Auth uses ARM_USE_OIDC + ARM_CLIENT_ID/TENANT_ID/SUBSCRIPTION_ID env vars in CI,
    # and az login credentials locally.
  }
}
