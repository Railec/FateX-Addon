/**
 * This class contains a bunch of data useful for the FateX-Addon module.
 * Stuff like Templates, ModuleId, etc.
 */
export class FateXAddon {
	static ModuleId: string = "FateX-Addon"
	static Templates = {
		ActorInventory: `modules/${this.ModuleId}/static/templates/ActorInventoryTemplate.hbs`
	}
}