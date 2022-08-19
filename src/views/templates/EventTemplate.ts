import {AbstractTemplate} from "../../abstracts/AbstractTemplate";
import {AbstractTemplateModal} from "../../abstracts/AbstractTemplateModal";

export class EventTemplate extends AbstractTemplate {
	protected generateFrontmatterTags(
	): string {
		return 'tags: [' + this.settings.eventTag + '/' + this.campaignId + ']\n';
	}

	protected generateFrontmatterSynopsis(
	): string {
		return 'synopsis: ""\n';
	}

	protected generateFrontmatterRelationships(
	): string|null {
		return ' characters: \n' +
			' clues: \n' +
			' locations: \n';
	}

	protected generateFrontmatterDates(
	): string|null {
		return ' event: \n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('event');
		response += this.getAdditionalInformation();

		return response;
	}
}

export class EventModal extends AbstractTemplateModal {
	protected content(
		contentEl: HTMLElement,
	): void {
		this.campaignBlock(contentEl);
	}
}

