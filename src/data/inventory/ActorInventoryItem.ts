import { FateXAddonItemModel } from "./FateXAddonItemModel.js";

export class ActorInventoryItem {
	static CUSTOM_ITEM_ID: string = "REFID#CUSTOM";

	private _referenceId: string = "";
	private _name: string = "";
	private _description: string = "";
	private _amount: number = 1;
	private _sort: number = 0;

	constructor(referenceId: string, amount: number = 1, sort: number = 0) {
		this._referenceId = referenceId;
		this._amount = amount;
		this._sort = sort;
	}

	public get referenceId(): string {
		return this._referenceId;
	}
	public set referenceId(referenceId: string) {
		this._referenceId = referenceId;
	}

	public get name(): string {
		if(this._referenceId !== ActorInventoryItem.CUSTOM_ITEM_ID && this._name === "") {
			let referenceItem = game.items?.contents.find(x => x.id === this._referenceId);
			if(referenceItem && (referenceItem as any).system instanceof FateXAddonItemModel) {
				return referenceItem.name ?? "-";
			} else {
				return "-";
			}
		}
		return this._name;
	}
	public set name(name: string | undefined) {
		if(name && name.trim().length > 0) {
			this._name = name;
		} else {
			this._name = "";
		}
	}

	public get description(): string {
		if(this._referenceId !== ActorInventoryItem.CUSTOM_ITEM_ID && this._description === "") {
			let referenceItem = game.items?.contents.find(x => x.id === this._referenceId);
			if(referenceItem && (referenceItem as any).system instanceof FateXAddonItemModel) {
				return (referenceItem as any).system.description.short ?? "-";
			} else {
				return game.i18n.localize("FATEX-ADDON.INVENTORY.ITEM.ERROR.InvalidReferenceId");
			}
		}
		return this._description;
	}
	public set description(description: string | undefined) {
		if(description && description.trim().length > 0) {
			this._description = description;
		} else {
			this._description = "";
		}
	}

	public get amount(): number {
		return this._amount;
	}
	public set amount(amount: number) {
		this._amount = amount;
	}

	public get sort(): number {
		return this._sort;
	}
	public set sort(sort: number) {
		this._sort = sort;
	}
}