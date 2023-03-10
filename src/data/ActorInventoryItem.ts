export class ActorInventoryItem {
	referenceId: string = "";
	name: string = "";
	description: string = "";
	sort: number = 0;
	amount: number = 1;

	constructor(referenceId: string, name: string, description: string, sort: number = 0, amount: number = 1) {
		this.referenceId = referenceId;
		this.name = name;
		this.description = description;
		this.sort = sort;
		this.amount = amount;
	}
}