import {AbstractHeaderView} from "../../../managers/viewsManager/abstracts/AbstractHeaderView";
import {NewHeaderViewInterface} from "../../../managers/viewsManager/interfaces/NewHeaderViewInterface";
import {SessionInterface} from "../interfaces/SessionInterface";
import {LongTextElement} from "../../../managers/viewsManager/elements/LongTextElement";
import {AbtStageElement} from "../../../services/plotsServices/views/elements/AbtStageElement";
import {DateElement} from "../../../services/dateService/views/elements/DateElement";
import {TimeElement} from "../../../services/dateService/views/elements/TimeElement";

export class SessionHeaderView extends AbstractHeaderView implements NewHeaderViewInterface {
	public model: SessionInterface;

	public render(
	): void {
		this.addBreadcrumb();
		this.addTitle();
		this.addComponentOptions();
		this.addGallery();
		this.addInfoElement(LongTextElement, {title: 'Description', values: this.model.synopsis ?? '<span class="missing">Synopsis Missing</span>', editableKey: 'data.synopsis'});

		this.addInfoElement(DateElement, {title: 'Session Date', values: this.model.irl, editableKey: 'data.irl'});

		if (this.api.settings.usePlotStructures)
			this.addInfoElement(AbtStageElement, {title: 'ABT Stage', values: this.model.abtStage, editableKey: 'data.abtStage'});

		if (this.api.settings.useSceneAnalyser)
			this.addInfoElement(TimeElement, {title: 'Target Duration', values: this.model.targetDuration, editableKey: 'data.targetDuration'});
	}
}
