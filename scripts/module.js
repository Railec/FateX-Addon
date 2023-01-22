import "./data/FateXAddon.js";
import "./data/ActorInventory.js";
import "./ui/ActorInventoryTab.js";

//Load templates on system init.
Hooks.once('init', async function () {
	loadTemplates([
		FateXAddon.Templates.ActorInventory
	]);
});

//Hook into the renderActorSheet to inject the inventory and spellbook tabs.
Hooks.on('renderActorSheet', async function (app, html, data) {
	if (app.object && app.object.name && app.object.flags) {
		console.log(`FateX-Addon | Initializing inventory tab for ${app.object.name}`);
		new ActorInventoryTab(app, app.object).render();
	}
});

//Hook into the preUpdateActor to intercept render calls for updates to the inventory flags.
Hooks.on('preUpdateActor', async function (fateActor, data, options, userId) {
	if (data.flags && data.flags.fatex.inventory) {
		options.render = false;
	}
});