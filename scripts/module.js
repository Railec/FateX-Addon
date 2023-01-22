import "./data/FateXAddon.js";
import "./data/ActorInventory.js";
import "./ui/ActorInventoryTab.js";

Hooks.once('init', async function () {
	loadTemplates([
		FateXAddon.Templates.ActorInventory
	]);
});

Hooks.on('renderActorSheet', async function (app, html, data) {
	if (app.object && app.object.name && app.object.flags) {
		console.log(`FateX-Addon | Initializing inventory tab for ${app.object.name}`);
		new ActorInventoryTab(app, app.object).render();
	}
});