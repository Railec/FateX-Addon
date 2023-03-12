//@ts-nocheck
export class FateXAddonItemModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			description: new fields.SchemaField({
				long: new fields.HTMLField({required: false, blank: true}),
				short: new fields.HTMLField({required: false, blank: true})
			})
		};
	}

	prepareDerivedData() {
	}
}