/**
 * The following class defines the Inventory tab for the FateX ActorSheet.
 */
class ActorInventoryTab {
	#application;
	#inventory;

	constructor(application, targetActor) {
		this.#application = application;
		this.#inventory = new ActorInventory(targetActor);
		this.#inventory.setup();
	}

	activateListeners(html) {
		html.find(".fatex-js-container-delete").click((e) => this._onContainerDelete.call(this, e, this.#inventory));
		html.find(".fatex-js-container-collapse").click((e) => this._onCollapseToggle.call(this, e, this.#inventory));
		html.find(".fatex-js-container-add").click((e) => this._onContainerAdd.call(this, e, this.#inventory));
	}

	render() {
		let data = {
			containers: this.#inventory.getContainers()
		};
		let html = renderTemplate(FateX_Addon.Templates.ActorInventory, data);
		this.activateListeners(html);

		this.#application.element.find(".fatex-desk__tabs .fatex-js-tabs-navigation").append(`
			<a class="fatex-tabs-navigation__item" data-tab="inventory">Inventory</a>
		`);

		this.#application.element.find(".fatex-desk__tabs .fatex-js-tab-content").append(`
			<div class="fatex-tab-content tab" data-tab="inventory"></div>
		`);
	}

	/**
	 * OnClick handler for deleting an item container.
	 */
	_onContainerDelete(e, actorInventory) {
		e.preventDefault();

		const parent = $(e.currentTarget).parent(".fatex-actions");
		if (parent.length > 0) {
			Dialog.confirm({
				title: "Delete item container",
				content: `<p>Delete item container: ${parent[0].dataset.container}?</p>`,
				yes: () => {
					if (actorInventory.removeContainer(parent[0].dataset.container)) {
						this.render();
					} else {
						ui.notifications.error(`Cannot remove the item container: ${parent[0].dataset.container}.`);
					}
				},
				no: () => { },
				defaultValue: false
			});
		}
	}

	/**
	 * OnClick handler for collapse button.
	 */
	_onCollapseToggle(e, actorInventory) {
		e.preventDefault();

		const parent = $(e.currentTarget).parent(".fatex-actions");
		if (parent.length > 0) {
			actorInventory.toggleContainerCollapse(parent[0].dataset.container);
		}

		this.render();
	}

	/**
	 * OnClick handler for adding a new item container.
	 */
	_onContainerAdd(e, actorInventory) {
		e.preventDefault();

		new Dialog({
			title: "Create new item container",
			content: `<p><label>Container name:</label><br/><input id="containerName" type="text"/></p>`,
			buttons: {
				cancelButton: {
					label: "Cancel",
					callback: (html) => { },
					icon: `<i class="fas fa-cancel"></i>`
				},
				createButton: {
					label: "Create",
					callback: (html) => {
						const value = html.find("input#containerName").val();

						if (value.trim() === "") {
							ui.notifications.error(`Cannot create a new item container without a name.`);
						} else if (actorInventory.addContainer(value, 0)) {
							this.render();
						} else {
							ui.notifications.error(`Cannot create a new item container.`);
						}
					},
					icon: `<i class="fas fa-check"></i>`
				}
			},
			default: "cancelButton"
		}).render(true);
	}
}