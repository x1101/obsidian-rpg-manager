import {AbstractTemplate} from "../../../abstracts/AbstractTemplate";
import {RpgFunctions} from "../../../RpgFunctions";

export class LocationTemplate extends AbstractTemplate {
	protected generateFrontmatterTags(
	): string {
		return 'tags: [' + RpgFunctions.settings.locationTag + '/' + this.campaignId + ']\n';
	}

	protected generateFrontmatterSynopsis(
	): string {
		return 'synopsis: ""\n';
	}

	protected generateFrontmatterAdditionalInformation(
	): string {
		return 'address: ""\n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('location');
		response += this.getAdditionalInformation();

		return response;
	}

	protected generateFrontmatterRelationships(
	): string|null {
		return ' locations: \n';
	}
}