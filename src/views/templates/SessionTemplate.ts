import {AbstractTemplate} from "../../abstracts/AbstractTemplate";
import {AbstractTemplateModal} from "../../abstracts/AbstractTemplateModal";

export class SessionTemplate extends AbstractTemplate {
	protected generateFrontmatterTags(
	): string {
		return 'tags: [' + this.settings.sessionTag + '/' + this.campaignId + '/' + this.adventureId + '/' + this.sessionId + ']\n';
	}

	protected generateFrontmatterSynopsis(
	): string {
		return 'synopsis: ""\n';
	}

	protected generateFrontmatterDates(
	): string|null {
		return ' session: \n' +
			' irl: \n';
	}

	protected generateTemplate(
	): string {
		let response = this.getRpgManagerCodeblock('sessionNavigation');
		response += this.getHeader('Introduction');
		response += '\n';
		response += this.getHeader('Plot');
		response += this.getHeader('ABT Plot', 3);
		response += this.getAbtPlot();
		response += this.getHeader('Story Circle Plot', 3);
		response += this.getStoryCirclePlot();
		response += this.getRpgManagerCodeblock('session');

		return response;
	}
}

export class SessionModal extends AbstractTemplateModal {
	protected content(
		contentEl: HTMLElement,
	): void {
		this.campaignBlock(contentEl);
		this.initialiseAdventures();
		this.adventureBlock(contentEl);
		this.initialiseSessions();
	}
}