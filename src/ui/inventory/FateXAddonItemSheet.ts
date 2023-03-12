import { FateXAddon } from "../../data/FateXAddon.js";

export class FateXAddonItemSheet extends ItemSheet {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["fatex", "fatex-sheet", "fatex-sheet--item", "sheet"],
			scrollY: [".fatex-desk__content"],
			width: 575
		});
	}

	get template() {
		return FateXAddon.Templates.Inventory.FateXAddonItem;
	}

	async getData(options={}) {
		const context = await super.getData(options) as any;
		context.description = {
			long: await TextEditor.enrichHTML((this.object as any).system.description.long, ({
				async: true,
				secrets: this.object.isOwner,
				relativeTo: this.object
			} as any)),
			short: await TextEditor.enrichHTML((this.object as any).system.description.short, ({
				async: true,
				secrets: this.object.isOwner,
				relativeTo: this.object
			} as any))
		};
		return context;
	}
}