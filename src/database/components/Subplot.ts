import {ComponentStage} from "./enums/ComponentStage";
import {SubplotInterface} from "./interfaces/SubplotInterface";
import {SubplotMetadataInterface} from "../interfaces/metadata/components/SubplotMetadataInterface";
import {AbstractSubplotData} from "./abstracts/data/AbstractSubplotData";

export class Subplot extends AbstractSubplotData implements SubplotInterface {
	protected metadata: SubplotMetadataInterface;
	public stage: ComponentStage = ComponentStage.Plot;
}
