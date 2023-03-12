import { SortMode } from "../../enums/SortMode.js";
import { ActorInventoryContainer } from "./ActorInventoryContainer.js";
import { ActorInventoryItem } from "./ActorInventoryItem.js";

/**
 * The following class defines access methods for the actor's inventory,
 * the data of which is stored in an actor's Flags.
 */
export class ActorInventory {
	#targetActor: Actor;
	containers: ActorInventoryContainer[] = [];

	constructor(target: Actor) {
		this.#targetActor = target;

		//Get the container data from the flag and construct the entire dataset in order to preserve object methods.
		let flagContainers = this.#targetActor.getFlag("fatex", "inventory") as ActorInventoryContainer[];
		flagContainers.forEach(c => {
			let newContainer = new ActorInventoryContainer(c.name, c.sort, c.sortMode);
			c.items.forEach(i => {
				let newItem = new ActorInventoryItem(i.referenceId, i.amount, i.sort);
				newItem.name = i.name;
				newItem.description = i.description;
				newContainer.items.push(newItem);
			});
			this.containers.push(newContainer);
		});
		if(!this.containers.find(x => x.name === "Equipped")) {
			this.containers.push(new ActorInventoryContainer("Equipped"));
			this.updateInventory();
		}
	}

	getContainers(): ActorInventoryContainer[] {
		return this.containers;
	}

	getContainer(name: string): ActorInventoryContainer | undefined {
		return this.containers.find(x => x.name === name);
	}

	addContainer(name: string, sort: number = 1, sortMode: SortMode = SortMode.User): ActorInventoryContainer | undefined {
		let targetContainer = this.getContainer(name);
		if(!targetContainer) {
			targetContainer = new ActorInventoryContainer(name, sort > 0 ? sort : 1, sortMode);
			this.containers.push(targetContainer);
		}

		return targetContainer;
	}

	removeContainer(name: string): void {
		let targetContainer = this.getContainer(name);
		if(targetContainer) {
			this.containers.splice(this.containers.indexOf(targetContainer), 1);
		}
	}

	modifyContainer(name: string, modifiedContainer: ActorInventoryContainer.Modification): ActorInventoryContainer | undefined {
		let targetContainer = this.getContainer(name);
		if(targetContainer) {
			if(modifiedContainer.name) {
				targetContainer.name = modifiedContainer.name;
			}
			if(modifiedContainer.sort) {
				targetContainer.sort = modifiedContainer.sort;
			}
			if(modifiedContainer.sortMode) {
				targetContainer.sortMode = modifiedContainer.sortMode;
			}
		}
		return targetContainer;
	}

	toggleContainerCollapse(name: string): void {
		let targetContainer = this.getContainer(name);
		if (targetContainer) {
			targetContainer.collapsed = !targetContainer.collapsed;
		}
	}

	updateInventory(): void {
		this.#targetActor.setFlag("fatex", "inventory", this.containers);
	}
}