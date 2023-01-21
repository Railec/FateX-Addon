class FateX_Addon {
	static ModuleId = "FateX-Addon"
	static Templates = {
		ActorInventory: `modules/${this.ModuleId}/templates/ActorInventoryTemplate.hbs`
	}
}

Hooks.once('init', async function () {
	loadTemplates([
		FateX_Addon.Templates.ActorInventory
	]);
});

Hooks.on('renderActorSheet', async function (app, html, data) {
	new ActorInventoryTab(app, data.actor).render();
});