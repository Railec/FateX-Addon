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
	console.log(`FateX-Addon | Initializing inventory tab for ${data.actor}`);
	if (data.actor) {
		new ActorInventoryTab(app, data.actor).render();
	}
});