import { SortMode } from "../enums/SortMode.js";
import { ActorInventoryItem } from "./ActorInventoryItem.js";

/**
 * The following class defines a container held in an actor's inventory.
 */
export class ActorInventoryContainer {
	name: string = "";
	sort: number = 0;
	sortMode: SortMode = SortMode.User;
	collapsed: boolean = false;
	items: ActorInventoryItem[] = [];

	constructor(name: string, sort: number = 0, sortMode: SortMode = SortMode.User) {
		this.name = name;
		this.sort = sort;
		this.sortMode = sortMode;
	}

	getItems(): ActorInventoryItem[] {
		return this.items;
	}

	getItem(referenceId: string): ActorInventoryItem | undefined {
		return this.items.find(x => x.referenceId === referenceId);
	}

	addItem(referenceId: string, amount: number, sort: number = 0): ActorInventoryItem | undefined {
		let targetItem = this.getItem(referenceId);
		if(targetItem) {
			targetItem.amount+= amount;
		} else {
			targetItem = new ActorInventoryItem(referenceId, amount, sort);
			this.items.push(targetItem);
		}
		return targetItem;
	}

	removeItem(referenceId: string, amount: number): void {
		let targetItem = this.getItem(referenceId);
		if(targetItem) {
			targetItem.amount-= amount;
			if(targetItem.amount <= 0) {
				this.items.splice(this.items.indexOf(targetItem), 1);
			}
		}
	}

	setItemSort(referenceId: string, sort: number): void {
		let targetItem = this.getItem(referenceId);
		if(targetItem) {
			targetItem.sort = sort;
		}
	}
}

export namespace ActorInventoryContainer {
	export class Modification {
		name?: string;
		sort?: number;
		sortMode?: SortMode;
	}
}