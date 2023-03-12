import { ActorInventory } from "../../../data/inventory/ActorInventory.js";
import { FateXAddon } from "../../../data/FateXAddon.js";
import { ActorInventoryTab } from "../ActorInventoryTab.js";

export class AddContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
	}

	async #getContent(): Promise<string> {
		return renderTemplate(FateXAddon.Templates.Inventory.Container.AddContainer, {});
	}

	#getButtons(): Record<string, Dialog.Button<unknown>> {
		return {
			create: {
				label: game.i18n.localize("Save"),
				callback: this.#onSave.bind(this),
				icon: `<i class="fas fa-check"></i>`
			},
			cancel: {
				label: game.i18n.localize("Cancel"),
				callback: this.#onCancel.bind(this),
				icon: `<i class="fas fa-cancel"></i>`
			}
		}
	}

	#onSave(html: any) {
		const name = $(html).find("input[name=name]").val()?.toString();

		if(name === undefined) {
			ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.ERROR.EmptyName"));
		} else if(this.#targetInventory.addContainer(name, 0)) {
			this.#targetInventory.updateInventory();
			this.#parent.render();
		} else {
			ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.ERROR.Generic")}: ${name}.`);
		}
	}

	#onCancel() {
	}

	async render(): Promise<void> {
		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Title"),
			content: await this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		}).render(true);
	}
}