/**
 * This class contains a bunch of data useful for the FateX-Addon module.
 * Stuff like Templates, ModuleId, etc.
 */
export class FateXAddon {
	static ModuleId = "FateX-Addon"
	static Templates = {
		ActorInventory: `modules/${this.ModuleId}/templates/ActorInventoryTemplate.hbs`
	}
}