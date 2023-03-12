import { FateXAddon } from "../../../data/FateXAddon.js";
import { ActorInventory } from "../../../data/inventory/ActorInventory.js";
import { ActorInventoryContainer } from "../../../data/inventory/ActorInventoryContainer.js";
import { ActorInventoryItem } from "../../../data/inventory/ActorInventoryItem.js";
import { FateXAddonItemModel } from "../../../data/inventory/FateXAddonItemModel.js";
import { ActorInventoryTab } from "../ActorInventoryTab.js";

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
		let itemReferences = game.items?.contents
			.filter(x => (x as any).system instanceof FateXAddonItemModel)
			.map(x => {
				return {
					id: x.id,
					name: x.name
				}
			});

		return renderTemplate(FateXAddon.Templates.Inventory.Item.AddItem, {
			itemReferences: itemReferences
		});
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
		const referenceId = $(html).find("select[name=referenceId]").val()?.toString();
		const name = $(html).find("input[name=name]").val()?.toString();
		const description = $(html).find("input[name=description]").val()?.toString();

		if(referenceId === undefined) {
			ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.ERROR.Generic")}: ${referenceId}.`);
		} else if(referenceId === ActorInventoryItem.CUSTOM_ITEM_ID
			   && (name === undefined || name.trim() === "")) {
			ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.ERROR.EmptyName"));
		} else {
			let newItem = this.#targetContainer.addItem(referenceId, 1);
			if(newItem) {
				if(name !== undefined && name.trim() !== "") {
					newItem.name = name;
				}
				if(description !== undefined && description.trim() !== "") {
					newItem.description = description;
				}
				this.#targetInventory.updateInventory();
				this.#parent.render();
			} else {
				ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.ERROR.Generic")}: ${referenceId}.`);
			}
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