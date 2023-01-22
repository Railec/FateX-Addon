/**
 * This class defines and controls the Inventory Tab.
 * It is intended and should only ever be used on a FateX actor sheet.
 * 
 * The inventory tab is injected into the actor sheet's html.
 * The tab provides controls for manipulating a FateX actor's "inventory",
 * which is a concept that Fate by default doesn't have and is borrowed in a lot of ways from DnD and similar.
 */
class ActorInventoryTab {
	#application;
	#inventory;

	constructor(application, targetActor) {
		this.#application = application;
		this.#inventory = new ActorInventory(targetActor);
		this.#inventory.setup();
	}

	activateListeners(html) {
		$(html).find(".fatex-js-container-delete").click((e) => this._onContainerDelete.call(this, e, this.#inventory));
		$(html).find(".fatex-js-container-collapse").click((e) => this._onCollapseToggle.call(this, e, this.#inventory));
		$(html).find(".fatex-js-container-add").click((e) => this._onContainerAdd.call(this, e, this.#inventory));
	}

	async render() {
		let data = {
			containers: this.#inventory.getContainers()
		};
		let html = await renderTemplate(FateXAddon.Templates.ActorInventory, data);

		if (this.#application.element.find(".tab[data-tab=inventory]").length) {
			this.#application.element.find(".tab[data-tab=inventory]").empty().append(`
				${html}
			`);
		} else {
			this.#application.element.find(".fatex-desk__tabs .fatex-js-tabs-navigation").append(`
				<a class="fatex-tabs-navigation__item" data-tab="inventory">${game.i18n.localize("FATEX-ADDON.Inventory")}</a>
			`);

			this.#application.element.find(".fatex-desk__tabs .fatex-js-tab-content").append(`
				<div class="fatex-tab-content tab" data-tab="inventory">
					${html}
				</div>
			`);
		}

		this.activateListeners(this.#application.element);
	}

	/**
	 * OnClick handler for deleting an item container.
	 */
	_onContainerDelete(e, actorInventory) {
		e.preventDefault();

		const parent = $(e.currentTarget).parent(".fatex-actions");
		if (parent.length > 0) {
			Dialog.confirm({
				title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Title"),
				content: `<p>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Content")}: ${parent[0].dataset.container}?</p>`,
				yes: () => {
					if (actorInventory.removeContainer(parent[0].dataset.container)) {
						this.render();
					} else {
						ui.notifications.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Fail")}: ${parent[0].dataset.container}.`);
					}
				},
				no: () => { },
				defaultValue: false
			});
		}
	}

	/**
	 * OnClick handler for collapse button.
	 */
	_onCollapseToggle(e, actorInventory) {
		e.preventDefault();

		const parent = $(e.currentTarget).parent(".fatex-actions");
		if (parent.length > 0) {
			actorInventory.toggleContainerCollapse(parent[0].dataset.container);
		}

		this.render();
	}

	/**
	 * OnClick handler for adding a new item container.
	 */
	_onContainerAdd(e, actorInventory) {
		e.preventDefault();

		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Title"),
			content: `<p><label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Content")}:</label><br/><input id="containerName" type="text"/></p>`,
			buttons: {
				createButton: {
					label: game.i18n.localize("Save"),
					callback: (html) => {
						const value = html.find("input#containerName").val(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.FailEmptyName"));

						if (value.trim() === "") {
							ui.notifications.error();
						} else if (actorInventory.addContainer(value, 0)) {
							this.render();
						} else {
							ui.notifications.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Fail")}: ${value}.`);
						}
					},
					icon: `<i class="fas fa-check"></i>`
				},
				cancelButton: {
					label: game.i18n.localize("Cancel"),
					callback: (html) => { },
					icon: `<i class="fas fa-cancel"></i>`
				}
			},
			default: "cancelButton"
		}).render(true);
	}
}