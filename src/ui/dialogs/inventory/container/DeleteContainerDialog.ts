import { ActorInventory } from "../../../../data/ActorInventory";
import { ActorInventoryContainer } from "../../../../data/ActorInventoryContainer";
import { ActorInventoryTab } from "../../../ActorInventoryTab";

export class DeleteContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;
	#foundryDialog: Dialog;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
		this.#foundryDialog = new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Title"),
			content: this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		});
	}

	#getContent(): string {
		return `
			<p>
				${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.DELETE.Content")}: ${this.#targetContainer.name}?
			</p>
		`;
	}

	#getButtons(): Record<string, Dialog.Button<unknown>> {
		return {
			confirm: {
				label: game.i18n.localize("Yes"),
				callback: this.#onConfirm,
				icon: `<i class="fas fa-check"></i>`
			},
			cancel: {
				label: game.i18n.localize("No"),
				callback: this.#onCancel,
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

	render(): void {
		this.#foundryDialog.render(true);
	}
}