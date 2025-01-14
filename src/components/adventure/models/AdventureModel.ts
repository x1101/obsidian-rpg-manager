import {AdventureInterface} from "../interfaces/AdventureInterface";
import {ComponentStage} from "../../../core/enums/ComponentStage";
import {AdventureMetadataInterface} from "../interfaces/AdventureMetadataInterface";
import {AbstractAdventureData} from "../abstracts/AbstractAdventureData";
import {DatabaseInterface} from "../../../managers/databaseManager/interfaces/DatabaseInterface";
import {RelationshipListInterface} from "../../../services/relationshipsService/interfaces/RelationshipListInterface";
import {ModelInterface} from "../../../managers/modelsManager/interfaces/ModelInterface";
import {RelationshipService} from "../../../services/relationshipsService/RelationshipService";
import {RelationshipType} from "../../../services/relationshipsService/enums/RelationshipType";

export class AdventureModel extends AbstractAdventureData implements AdventureInterface {
	protected metadata: AdventureMetadataInterface;
	public stage: ComponentStage = ComponentStage.Plot;

	getRelationships(
		database?: DatabaseInterface
	): RelationshipListInterface {
		const response: RelationshipListInterface = super.getRelationships(database);

		this.api.database.read<ModelInterface>((model: ModelInterface) =>
			model.id.campaignId === this.id.campaignId &&
			model.id.adventureId === this.id.adventureId
		).forEach((model: ModelInterface) => {
			response.add(this.api.service(RelationshipService).createRelationship(
				RelationshipType.Hierarchy,
				model.file.path,
				undefined,
				model,
			));
		});

		return response;
	}
}
