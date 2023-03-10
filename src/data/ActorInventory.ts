import { SortMode } from "../enums/SortMode.js";
import {ActorInventoryContainer} from "./ActorInventoryContainer.js";

/**
 * The following class defines access methods for the actor's inventory,
 * the data of which is stored in an actor's Flags.
 */
export class ActorInventory {
	#targetActor: Actor;

	constructor(target: Actor) {
		this.#targetActor = target;
	}

	setup(): void {
		let containers = this.getContainers();

		if (!containers || containers.filter(c => c.name === "Equipped").length === 0) {
			this.#targetActor.setFlag("fatex", "inventory", [new ActorInventoryContainer("Equipped")]);
		}
	}

	getContainers(): ActorInventoryContainer[] {
		return this.#targetActor.getFlag("fatex", "inventory") as ActorInventoryContainer[];
	}

	addContainer(name: string, sort: number = 1, sortMode: SortMode = SortMode.User): boolean {
		let containers = this.getContainers();

		if (containers.filter(c => c.name === name).length === 0) {
			if (sort <= 0)
				sort = 1;

			containers.push(new ActorInventoryContainer(name, sort, sortMode));
			this.#targetActor.setFlag("fatex", "inventory", containers);

			return true;
		}
		return false;
	}

	removeContainer(name: string): boolean {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			let index = containers.indexOf(targetContainer[0]);
			if (index > -1) {
				containers.splice(index, 1);
				this.#targetActor.setFlag("fatex", "inventory", containers);

				return true;
			}
		}
		return false;
	}

	renameContainer(name: string, newName: string): boolean {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			targetContainer[0].name = newName;
			this.#targetActor.setFlag("fatex", "inventory", containers);

			return true;
		}
		return false;
	}

	toggleContainerCollapse(name: string): void {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			targetContainer[0].collapsed = !targetContainer[0].collapsed;
			this.#targetActor.setFlag("fatex", "inventory", containers);
		}
	}

	setContainerSortMode(name: string, sortMode: SortMode): void {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			targetContainer[0].sortMode = sortMode;
			this.#targetActor.setFlag("fatex", "inventory", containers);
		}
	}

	addItem(container: string, referenceId: string, amount: number, sort: number = 0): boolean {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === container);
		if (targetContainer.length > 0) {
			let targetItem = targetContainer[0].items.filter(i => i.referenceId === referenceId);
			if (targetItem.length > 0) {
				targetItem[0].amount += amount;
			} else {
				/*targetContainer[0].items.push({
					referenceId: referenceId,
					name: "",
					description: "",
					sort: sort,
					amount: amount
				});*/
			}
			this.#targetActor.setFlag("fatex", "inventory", containers);

			return true;
		}
		return false;
	}

	removeItem(container: string, referenceId: string, amount: number): boolean {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === container);
		if (targetContainer.length > 0) {
			let targetItem = targetContainer[0].items.filter(i => i.referenceId === referenceId);
			if (targetItem.length > 0) {
				targetItem[0].amount -= amount;
				if (targetItem[0].amount <= 0) {
					let index = targetContainer[0].items.indexOf(targetItem[0]);
					if(index > -1) {
						targetContainer[0].items.splice(index, 1);
					}
				}
				this.#targetActor.setFlag("fatex", "inventory", containers);

				return true;
			}
		}
		return false;
	}
}