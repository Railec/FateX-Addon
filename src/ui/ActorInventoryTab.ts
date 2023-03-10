import { FateXAddon } from "../data/FateXAddon.js";
import { ActorInventory } from "../data/ActorInventory.js";

/**
 * This class defines and controls the Inventory Tab.
 * It is intended and should only ever be used on a FateX actor sheet.
 * 
 * The inventory tab is injected into the actor sheet's html.
 * The tab provides controls for manipulating a FateX actor's "inventory",
 * which is a concept that Fate by default doesn't have and is borrowed in a lot of ways from DnD and similar.
 */
export class ActorInventoryTab {
	#application: Application;
	#inventory: ActorInventory;

	constructor(application: Application, targetActor: Actor) {
		this.#application = application;
		this.#inventory = new ActorInventory(targetActor);
		this.#inventory.setup();
	}

	activateListeners(html: any): void {
		$(html).find(".fatex-addon-js-container-sort").on("click", (e) => this._onContainerSort.call(this, e, this.#inventory));
		$(html).find(".fatex-addon-js-container-modify").on("click", (e) => this._onContainerModify.call(this, e, this.#inventory));
		$(html).find(".fatex-addon-js-container-delete").on("click", (e) => this._onContainerDelete.call(this, e, this.#inventory));
		$(html).find(".fatex-addon-js-container-collapse").on("click", (e) => this._onCollapseToggle.call(this, e, this.#inventory));
		$(html).find(".fatex-addon-js-container-add").on("click", (e) => this._onContainerAdd.call(this, e, this.#inventory));
		$(html).find(".fatex-addon-js-item-add").on("click", (e) => this._onItemAdd.call(this, e, this.#inventory));
	}

	async render(): Promise<void> {
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
	 * OnClick handler for sort-dragging an item container.
	 */
	_onContainerSort(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();
	}

	/**
	 * OnClick handler for modifying an item container.
	 */
	_onContainerModify(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			Dialog.confirm({
				title: game.i18n.localize("FATEX_ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Title"),
				content: `<p><label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Content")}:</label><br/><input id="containerName" type="text"/></p>`,
				yes: (html) => {
					const value = html.find("input#containerName").val()?.toString();

					if (value === undefined) {
						ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.FailEmptyName"));
					} else if (actorInventory.renameContainer(parent[0].dataset.container, value)) {
						this.render();
					} else {
						ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Fail")}: ${parent[0].dataset.container}.`);
					}
				},
				no: (html) => { },
				defaultYes: false
			});
		}
	}

	/**
	 * OnClick handler for deleting an item container.
	 */
	_onContainerDelete(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			Dialog.confirm({
				title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Title"),
				content: `<p>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Content")}: ${parent[0].dataset.container}?</p>`,
				yes: (html) => {
					if (actorInventory.removeContainer(parent[0].dataset.container)) {
						this.render();
					} else {
						ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Fail")}: ${parent[0].dataset.container}.`);
					}
				},
				no: (html) => { },
				defaultYes: false
			});
		}
	}

	/**
	 * OnClick handler for collapse button.
	 */
	_onCollapseToggle(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			actorInventory.toggleContainerCollapse(parent[0].dataset.container);
		}

		this.render();
	}

	/**
	 * OnClick handler for adding a new item container.
	 */
	_onContainerAdd(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Title"),
			content: `<p><label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Content")}:</label><br/><input id="containerName" type="text"/></p>`,
			buttons: {
				createButton: {
					label: game.i18n.localize("Save"),
					callback: (html) => {
						const value = $(html).find("input#containerName").val()?.toString();

						if (value === undefined) {
							ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.FailEmptyName"));
						} else if (actorInventory.addContainer(value, 0)) {
							this.render();
						} else {
							ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Fail")}: ${value}.`);
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

	/**
	 * OnClick handler for adding a new item to a container.
	 */
	_onItemAdd(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			actorInventory.addItem(parent[0].dataset.container, "", 1);
		}
	}
}