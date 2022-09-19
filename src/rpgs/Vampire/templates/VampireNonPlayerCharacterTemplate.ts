import {NonPlayerCharacterTemplateFactory} from "../../../factories/templates/NonPlayerCharacterTemplateFactory";

export class VampireNonPlayerCharacterTemplate extends NonPlayerCharacterTemplateFactory {
	public addFrontmatterData(
		frontmatter: any,
	): void {
	}

	public generateInitialCodeBlock(
	): string|undefined {
		return undefined;
	}

	public generateLastCodeBlock(
	): string|undefined {
		return undefined;
	}

/*
protected generateFrontmatterAdditionalInformation(
): string {
	let response = super.generateFrontmatterAdditionalInformation();
	response += 'generation: \n';

	return response;
}

 */
}