/**
 * This class contains a bunch of data useful for the FateX-Addon module.
 * Stuff like Templates, ModuleId, etc.
 */
export class FateXAddon {
	static ModuleId: string = "FateX-Addon"
	static Templates = {
		Inventory: {
			FateXAddonItem: `modules/${this.ModuleId}/static/templates/inventory/FateXAddonItemTemplate.hbs`,
			ActorInventory: `modules/${this.ModuleId}/static/templates/inventory/ActorInventoryTemplate.hbs`,
			Container: {
				AddContainer: `modules/${this.ModuleId}/static/templates/inventory/container/AddContainerTemplate.hbs`,
				DeleteContainer: `modules/${this.ModuleId}/static/templates/inventory/container/DeleteContainerTemplate.hbs`,
				ModifyContainer: `modules/${this.ModuleId}/static/templates/inventory/container/ModifyContainerTemplate.hbs`,
			},
			Item: {
				AddItem: `modules/${this.ModuleId}/static/templates/inventory/item/AddItemTemplate.hbs`
			}
		}
	}
}