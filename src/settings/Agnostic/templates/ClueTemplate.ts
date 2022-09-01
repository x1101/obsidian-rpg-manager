import {AbstractTemplate} from "../../../abstracts/AbstractTemplate";
import {RpgFunctions} from "../../../RpgFunctions";

export class ClueTemplate extends AbstractTemplate {
	protected generateFrontmatterTags(
	): string {
		return 'tags: [' + RpgFunctions.settings.clueTag + '/' + this.campaignId + ']\n';
	}

	protected generateFrontmatterSynopsis(
	): string {
		return 'synopsis: ""\n';
	}

	protected generateFrontmatterRelationships(
	): string|null {
		return ' characters: \n' +
			' locations: \n';
	}

	protected generateFrontmatterDates(
	): string|null {
		return ' found: \n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('clue');
		response += this.getAdditionalInformation();

		return response;
	}
}
