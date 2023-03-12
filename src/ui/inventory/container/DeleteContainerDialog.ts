import { FateXAddon } from "../../../data/FateXAddon.js";
import { ActorInventory } from "../../../data/inventory/ActorInventory.js";
import { ActorInventoryContainer } from "../../../data/inventory/ActorInventoryContainer.js";
import { ActorInventoryTab } from "../ActorInventoryTab.js";

export class DeleteContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
	}

	async #getContent(): Promise<string> {
		return renderTemplate(FateXAddon.Templates.Inventory.Container.DeleteContainer, {
			name: this.#targetContainer.name
		});
	}

	#getButtons(): Record<string, Dialog.Button<unknown>> {
		return {
			confirm: {
				label: game.i18n.localize("Yes"),
				callback: this.#onConfirm.bind(this),
				icon: `<i class="fas fa-check"></i>`
			},
			cancel: {
				label: game.i18n.localize("No"),
				callback: this.#onCancel.bind(this),
				icon: `<i class="fas fa-cancel"></i>`
			}
		}
	}

	#onConfirm(html: any): void {
		this.#targetInventory.removeContainer(this.#targetContainer.name);
		this.#targetInventory.updateInventory();
		this.#parent.render();
	}

	#onCancel(): void {
	}

	async render(): Promise<void> {
		new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Title"),
			content: await this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		}).render(true);
	}
}