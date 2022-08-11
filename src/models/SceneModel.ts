import {AbstractModel} from "../abstracts/AbstractModel";
import {RpgViewFactory, viewType} from "../factories/RpgViewFactory";
import {SceneData} from "../data/SceneData";
import {SessionData} from "../data/SessionData";
import {AdventureData} from "../data/AdventureData";
import {DataType} from "../io/IoData";

export class SceneModel extends AbstractModel {
	public async render() {
		this.sceneNavigator();
		this.characterList();
		this.locationList();
		this.clueList();
	}
	
	private async sceneNavigator(
	) {
		const current = this.dv.current();
		
		if (
			current != undefined &&
			current.ids != undefined &&
			current.ids.scene != undefined &&
			current.ids.session != undefined
		) {
			const sessions = this.dv.pages("#session")
				.where(session =>
					session.file.folder !== "Templates" &&
					session.ids != undefined &&
					session.ids?.session != undefined &&
					session.ids?.session === current?.ids?.session
				);

			const session = sessions != undefined && sessions.length === 1 ? sessions[0] : null;

			const adventures = this.dv.pages("#adventure")
				.where(adventure =>
					adventure.file.folder !== "Templates" &&
					adventure.ids !== undefined &&
					adventure.ids.adventure === session.ids.adventure
				);
			const adventure = adventures != undefined && adventures.length === 1 ? adventures[0] : null;

			const previousScenes = this.dv.pages("#scene")
				.where(scene =>
					scene.file.folder !== "Templates" &&
					scene.ids != undefined &&
					scene.ids.session === current?.ids.session &&
					scene.ids.scene === current?.ids.scene - 1
				);
			const previousScene = previousScenes != undefined && previousScenes.length === 1 ? previousScenes[0] : null;

			const nextScenes = this.dv.pages("#scene")
				.where(scene =>
					scene.file.folder !== "Templates" &&
					scene.ids != undefined &&
					scene.ids.session === current?.ids.session &&
					scene.ids.scene === current?.ids.scene + 1
				);
			const nextScene = nextScenes != undefined && nextScenes.length === 1 ? nextScenes[0] : null;

			const data = new SceneData(
				this.functions,
				current,
				(session != undefined ? new SessionData(this.functions, session) : null),
				(adventure != undefined ? new AdventureData(this.functions, adventure) : null),
				(previousScene != undefined ? new SceneData(this.functions, previousScene) : null),
				(nextScene != undefined ? new SceneData(this.functions, nextScene) : null),
				this.campaign,
			)

			const view = RpgViewFactory.createSingle(viewType.SceneNavigator, this.dv);
			view.render(data);
		}
	}

	private async characterList(
	) {
		this.writeList(
			this.io.getRelationshipList(
				DataType.Character,
			),
			viewType.CharacterList,
		);
	}

	private async locationList(
	) {
		this.writeList(
			this.io.getRelationshipList(
				DataType.Location,
			),
			viewType.LocationList,
		);
	}

	private async clueList(
	) {
		this.writeList(
			this.io.getRelationshipList(
				DataType.Clue,
			),
			viewType.ClueList,
		);
	}
}
