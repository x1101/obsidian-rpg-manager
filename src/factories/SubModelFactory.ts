import {ResponseDataElementInterface} from "../interfaces/response/ResponseDataElementInterface";
import {SubModelInterface} from "../interfaces/SubModelInterface";
import {AbstractFactory} from "../abstracts/AbstractFactory";
import {App} from "obsidian";
import {SubModelFactoryInterface} from "../interfaces/factories/SubModelFactoryInterface";
import {ComponentInterface} from "../database/interfaces/ComponentInterface";
import {RelationshipInterface} from "../database/relationships/interfaces/RelationshipInterface";

export class SubModelFactory extends AbstractFactory implements SubModelFactoryInterface{
	public async create<T extends SubModelInterface>(
		subModelType: (new (app: App, currentElement: ComponentInterface) => T),
		currentElement: ComponentInterface,
		data: RelationshipInterface|RelationshipInterface[],
		title: string|undefined=undefined,
		additionalInformation: any|undefined=undefined,
	): Promise<ResponseDataElementInterface|null> {
		const subModel: SubModelInterface = new subModelType(this.app, currentElement);
		return subModel.generateData(data, title, additionalInformation);
	}
}
