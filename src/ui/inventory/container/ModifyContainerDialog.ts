import { FateXAddon } from "../../../data/FateXAddon.js";
import { ActorInventory } from "../../../data/ActorInventory.js";
import { ActorInventoryContainer } from "../../../data/ActorInventoryContainer.js";
import { ActorInventoryTab } from "../../ActorInventoryTab.js";

export class ModifyContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
	}

	async #getContent(): Promise<string> {
		return renderTemplate(FateXAddon.Templates.Inventory.Container.ModifyContainer, {
			name: this.#targetContainer.name
		});
	}

	#getButtons(): Record<string, Dialog.Button<unknown>> {
		return {
			confirm: {
				label: game.i18n.localize("Save"),
				callback: this.#onConfirm,
				icon: `<i class="fas fa-check"></i>`
			},
			cancel: {
				label: game.i18n.localize("Cancel"),
				callback: this.#onCancel,
				icon: `<i class="fas fa-cancel"></i>`
			}
		}
	}

	#onConfirm(html: any): void {
		const newName = html.find("input[name=name]").val()?.toString();

		if (newName === undefined) {
			ui.notifications?.error(game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.ERROR.EmptyName"));
		} else {
			let modifiedContainer = {
				name: newName
			};
			if(this.#targetInventory.modifyContainer(this.#targetContainer.name, modifiedContainer)) {
				this.#targetInventory.updateInventory();
				this.#parent.render();
			} else {
				ui.notifications?.error(`${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.ERROR.Generic")}: ${this.#targetContainer}.`);
			}
		}
	}

	#onCancel(): void {
	}

	async render(): Promise<void> {
		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Title"),
			content: await this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		}).render(true);
	}
}