import { ActorInventory } from "../../../../data/ActorInventory";
import { ActorInventoryTab } from "../../../ActorInventoryTab";

export class AddContainerDialog {
	#parent: ActorInventoryTab;
	#targetInventory: ActorInventory;
	#foundryDialog: Dialog;

	constructor(parent: ActorInventoryTab, targetInventory: ActorInventory) {
		this.#parent = parent;
		this.#targetInventory = targetInventory;
		this.#foundryDialog = new Dialog({
			title: game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Title"),
			content: this.#getContent(),
			buttons: this.#getButtons(),
			default: "cancel"
		});
	}

	#getContent(): string {
		return `
			<p>
				<label>${game.i18n.localize("FATEX-ADDON.INVENTORY.DIALOG.CONTAINER.ADD.Content")}:</label>
				<br/>
				<input id="containerName" type="text"/>
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
		const name = $(html).find("input#containerName").val()?.toString();

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

	render(): void {
		this.#foundryDialog.render(true);
	}
}