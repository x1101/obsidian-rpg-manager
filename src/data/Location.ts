import {AbstractRpgElementData} from "../abstracts/AbstractRpgElementData";
import {LocationInterface} from "../interfaces/data/LocationInterface";

export class Location extends AbstractRpgElementData implements LocationInterface {
	public address: string|null;

	protected loadData(
	): void {
		this.address = this.frontmatter?.address;

		super.loadData();
	}
}
