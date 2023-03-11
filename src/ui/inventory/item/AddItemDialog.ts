import { FateXAddon } from "../../../data/FateXAddon.js";
import { ActorInventory } from "../../../data/ActorInventory.js";
import { ActorInventoryContainer } from "../../../data/ActorInventoryContainer.js";
import { ActorInventoryTab } from "../../ActorInventoryTab.js";

export class AddItemDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
	}

	async #getContent(): Promise<string> {
		return renderTemplate(FateXAddon.Templates.Inventory.Item.AddItem, {});
	}

	#getButtons(): Record<string, Dialog.Button<unknown>> {
		return {
			create: {
				label: game.i18n.localize("Save"),
				callback: this.#onSave,
				icon: `<i class="fas fa-check"></i>`
			},
			cancel: {
				label: game.i18n.localize("Cancel"),
				callback: this.#onCancel,
				icon: `<i class="fas fa-cancel"></i>`
			}
		}
	}

	#onSave(html: any) {
		const name = $(html).find("input[name=name]").val()?.toString();

		if(name === undefined) {
			ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.ERROR.EmptyName"));
		} else if(this.#targetContainer.addItem(name, 0)) {
			this.#targetInventory.updateInventory();
			this.#parent.render();
		} else {
			ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.ERROR.Generic")}: ${name}.`);
		}
	}

	#onCancel() {
	}

	async render(): Promise<void> {
		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.Title"),
			content: await this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		}).render(true);
	}
}