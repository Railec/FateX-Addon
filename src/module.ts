import { FateXAddon } from "./data/FateXAddon.js";
import { ActorInventoryTab } from "./ui/ActorInventoryTab.js";

//Load templates on system init.
Hooks.once('init', async function () {
	console.log(`${FateXAddon.ModuleId} | Initializing addon`);

	loadTemplates([
		FateXAddon.Templates.Inventory.ActorInventory,
		FateXAddon.Templates.Inventory.Container.AddContainer,
		FateXAddon.Templates.Inventory.Container.DeleteContainer,
		FateXAddon.Templates.Inventory.Container.ModifyContainer,
		FateXAddon.Templates.Inventory.Item.AddItem
	]);
});

//Hook into the renderActorSheet to inject the inventory and spellbook tabs.
Hooks.on('renderActorSheet', async function (app: any, html: any, data: any) {
	if (app.object && app.object.name && app.object.flags) {
		console.log(`${FateXAddon.ModuleId} | Initializing inventory tab for ${app.object.name}`);
		new ActorInventoryTab(app, app.object).render();
	}
});

//Hook into the preUpdateActor to intercept render calls for updates to the inventory flags.
Hooks.on('preUpdateActor', async function (fateActor: any, data: any, options: any, userId: any) {
	if (data.flags && data.flags.fatex.inventory) {
		options.render = false;
	}
});