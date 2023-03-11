import { ActorInventory } from "../../../../data/ActorInventory";
import { ActorInventoryContainer } from "../../../../data/ActorInventoryContainer";
import { ActorInventoryTab } from "../../../ActorInventoryTab";

export class AddItemDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#targetContainer: ActorInventoryContainer;
	#foundryDialog: Dialog;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory, targetContainer: ActorInventoryContainer) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#targetContainer = targetContainer;
		this.#foundryDialog = new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.Title"),
			content: this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		});
	}

	#getContent(): string {
		return `
			<p>
				<label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.ITEM.ADD.Content")}:</label>
				<br/>
				<input id="itemName" type="text"/>
			</p>
		`;
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
		const name = $(html).find("input#itemName").val()?.toString();

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

	render(): void {
		this.#foundryDialog.render(true);
	}
}