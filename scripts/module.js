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
	if (app.object && app.object.name && app.object.flags) {
		console.log(`FateX-Addon | Initializing inventory tab for ${app.object.name}`);
		new ActorInventoryTab(app, app.object).render();
	}
});