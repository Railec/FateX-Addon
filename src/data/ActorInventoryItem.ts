export class ActorInventoryItem {
	static CUSTOM_ITEM_ID: string = "REFID#CUSTOM";

	referenceId: string = "";
	name: string = "";
	description: string = "";
	amount: number = 1;
	sort: number = 0;

	constructor(referenceId: string, amount: number = 1, sort: number = 0) {
		this.referenceId = referenceId;
		this.setName();
		this.setDescription();
		this.amount = amount;
		this.sort = sort;
	}

	setName(name?: string): void {
		if(name && name.trim().length > 0) {
			this.name = name;
		} else if(this.referenceId !== ActorInventoryItem.CUSTOM_ITEM_ID) {
			//todo: retrieve name from referenced item.
		}
	}

	setDescription(description?: string): void {
		if(description && description.trim().length > 0) {
			this.description = description;
		} else if(this.referenceId !== ActorInventoryItem.CUSTOM_ITEM_ID) {
			if(this.referenceId.trim().length === 0) {
				this.description = game.i18n.localize("FATEX-ADDON.INVENTORY.ITEM.ERROR.InvalidReferenceId");
			}
			//todo: retrieve description from references item.
		}
	}
}