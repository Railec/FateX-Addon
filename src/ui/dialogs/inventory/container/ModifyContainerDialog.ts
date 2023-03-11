import { ActorInventory } from "../../../../data/ActorInventory.js";
import { ActorInventoryContainer } from "../../../../data/ActorInventoryContainer.js";
import { ActorInventoryTab } from "../../../ActorInventoryTab.js";

export class ModifyContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;
	#foundryDialog: Dialog;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
		this.#foundryDialog = new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Title"),
			content: this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		});
	}

	#getContent(): string {
		return `
			<p>
				<label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.MODIFY.Content")}:</label>
				<br/>
				<input id="containerName" type="text" value="${this.#targetContainer.name}"/>
			</p>
		`;
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

	#onConfirm(html): void {
		const newName = html.find("input#containerName").val()?.toString();

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

	render(): void {
		this.#foundryDialog.render(true);
	}
}