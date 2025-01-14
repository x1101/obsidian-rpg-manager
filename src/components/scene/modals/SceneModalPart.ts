import {ComponentType} from "../../../core/enums/ComponentType";
import {SceneInterface} from "../interfaces/SceneInterface";
import {AbstractModalPart} from "../../../managers/modalsManager/abstracts/AbstractModalPart";
import {RpgManagerApiInterface} from "../../../api/interfaces/RpgManagerApiInterface";
import {IdService} from "../../../services/idService/IdService";
import {ModalInterface} from "../../../core/interfaces/ModalInterface";

export class SceneModalPart extends AbstractModalPart {
	private _scenes: SceneInterface[];

	constructor(
		api: RpgManagerApiInterface,
		modal: ModalInterface,
	) {
		super(api, modal);
		this.modal.sceneId = this.api.service(IdService).create(ComponentType.Scene, this.modal.campaignId.id, this.modal.adventureId?.id, this.modal.actId?.id);
		this.modal.sceneId.id = 0;

		if (this.modal.adventureId != null && this.modal.actId != null)
			this._scenes = this.api.database.readList<SceneInterface>(ComponentType.Scene, this.modal.actId);
		else
			this._scenes = [];

	}

	public async addElement(
		contentEl: HTMLElement,
	): Promise<void> {
		contentEl.createDiv({cls: 'sceneContainer'});
		this._scenes.forEach((scene: SceneInterface) => {
			if (this.modal.sceneId !== undefined && (scene.id.sceneId ?? 0) >= (this.modal.sceneId.id ?? 0)) {
				this.modal.sceneId.id = ((scene.id.sceneId ?? 0) + 1);
			}
		});

		this.modal.saver = this;
		this.modal.enableButton();
	}

	public async loadChild(
		containerEl: HTMLElement,
	): Promise<void> {
	}

	public validate(
	): boolean {
		if (this.modal.sceneId?.id === 0)
			this.modal.sceneId.id = 1;

		return true;
	}

	protected async addAdditionalElements(
	): Promise<void> {
		//this.modal.additionalInformationEl
	}
}
