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
}