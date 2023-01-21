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
	$(html).find(".fatex-desk__tabs .fatex-js-tabs-navigation").append(`
		<a class="fatex-tabs-navigation__item" data-tab="inventory">Inventory</a>
		<a class="fatex-tabs-navigation__item" data-tab="spellbook">Spellbook</a>
	`);

	$(html).find(".fatex-desk__tabs .fatex-js-tab-content").append(`
		<div class="fatex-tab-content tab" data-tab="inventory"></div>
		<div class="fatex-tab-content tab" data-tab="spellbook"></div>
	`);
});