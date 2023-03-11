import { FateXAddon } from "../data/FateXAddon.js";
import { ActorInventory } from "../data/ActorInventory.js";
import { ModifyContainerDialog } from "./dialogs/inventory/container/ModifyContainerDialog.js";
import { DeleteContainerDialog } from "./dialogs/inventory/container/DeleteContainerDialog.js";
import { AddContainerDialog } from "./dialogs/inventory/container/AddContainerDialog.js";
import { AddItemDialog } from "./dialogs/inventory/item/AddItemDialog.js";

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
			let targetContainer = this.#inventory.getContainer(parent[0].dataset.container);
			if(targetContainer) {
				let dialog = new ModifyContainerDialog(this, actorInventory, targetContainer);
				dialog.render();
			} else {
				ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.CONTAINER.ERROR.InvalidContainerName")}: ${parent[0].dataset.container}`);
			}
		}
	}

	/**
	 * OnClick handler for deleting an item container.
	 */
	_onContainerDelete(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			let targetContainer = this.#inventory.getContainer(parent[0].dataset.container);
			if(targetContainer) {
				let dialog = new DeleteContainerDialog(this, actorInventory, targetContainer);
				dialog.render();
			} else {
				ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.CONTAINER.ERROR.InvalidContainerName")}: ${parent[0].dataset.container}`);
			}
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

		let dialog = new AddContainerDialog(this, actorInventory);
		dialog.render();
	}

	/**
	 * OnClick handler for adding a new item to a container.
	 */
	_onItemAdd(e: JQuery.ClickEvent, actorInventory: ActorInventory): void {
		e.preventDefault();

		const parent = $(e.currentTarget).parents(".fatex-item-container");
		if (parent.length > 0) {
			let targetContainer = this.#inventory.getContainer(parent[0].dataset.container);
			if(targetContainer) {
				let dialog = new AddItemDialog(this, this.#inventory, targetContainer);
				dialog.render();
			} else {
				ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.CONTAINER.ERROR.InvalidContainerName")}: ${parent[0].dataset.container}`);
			}
		}
	}
}