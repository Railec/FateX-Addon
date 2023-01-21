/**
 * The following class defines access methods for the actor's inventory,
 * the data of which is stored in an actor's Flags.
 */
class ActorInventory {
	static SortMode = {
		Alphabetical: 0,
		Amount: 1,
		User: 2
	}

	#targetActor;

	constructor(target) {
		this.targetActor = target;
	}

	setup() {
		let inventory = this.targetActor.getFlag("fatex", "inventory");

		let equipped = {
			name: "Equipped",
			sort: 0,
			sortMode: ActorInventory.SortMode.User,
			collapsed: false,
			items: []
		};
		if (!inventory || inventory.filter(c => c.name === equipped.name).length === 0) {
			this.targetActor.setFlag("fatex", "inventory", [equipped]);
		}
	}

	getContainers() {
		return this.targetActor.getFlag("fatex", "inventory");
	}

	addContainer(name, sort = 1, sortMode = ActorInventory.SortMode.User) {
		let containers = this.getContainers();

		if (containers.filter(c => c.name === name).length === 0) {
			if (sort <= 0)
				sort = 1;

			containers.push({
				name: name,
				sort: sort,
				sortMode: sortMode,
				collapsed: false,
				items: []
			});
			this.targetActor.setFlag("fatex", "inventory", containers);

			return true;
		}
		return false;
	}

	removeContainer(name) {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			let index = containers.indexOf(targetContainer[0]);
			if (index > -1) {
				containers.splice(index, 1);
				this.targetActor.setFlag("fatex", "inventory", containers);

				return true;
			}
		}
		return false;
	}

	toggleContainerCollapse(name) {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === name);
		if (targetContainer.length > 0) {
			targetContainer[0].collapsed = !targetContainer[0].collapsed;
			this.targetActor.setFlag("fatex", "inventory", containers);
		}
	}

	addItem(container, referenceId, amount, sort = 0) {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === container);
		if (targetContainer.length > 0) {
			let targetItem = targetContainer[0].filter(i => i.referenceId === referenceId);
			if (targetItem.length > 0) {
				targetItem[0].amount += amount;
			} else {
				targetContainer[0].push({ referenceId: referenceId, sort: sort, amount: amount });
			}
			this.targetActor.setFlag("fatex", "inventory", containers);

			return true;
		}
		return false;
	}

	removeItem(container, referenceId, amount) {
		let containers = this.getContainers();

		let targetContainer = containers.filter(c => c.name === container);
		if (targetContainer.length > 0) {
			let targetItem = targetContainer[0].filter(i => i.referenceId === referenceId);
			if (targetItem.length > 0) {
				targetItem[0].amount -= amount;
				if (targetItem[0].amount < 0) {
					targetContainer[0].remove(targetItem[0]);
				}
			}
			this.targetActor.setFlag("fatex", "inventory", inventory);

			return true;
		}
		return false;
	}
}