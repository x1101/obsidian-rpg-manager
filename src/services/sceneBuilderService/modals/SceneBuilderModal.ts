import {ActInterface} from "../../../components/act/interfaces/ActInterface";
import {ComponentType} from "../../../core/enums/ComponentType";
import {SceneInterface} from "../../../components/scene/interfaces/SceneInterface";
import {AbstractModal} from "../../../managers/modalsManager/abstracts/AbstractModal";
import {RpgManagerApiInterface} from "../../../api/interfaces/RpgManagerApiInterface";
import {AnalyserService} from "../../analyserService/AnalyserService";
import {FileCreationService} from "../../fileCreationService/FileCreationService";
import {activeSceneTypes, SceneType, sceneTypeDescription} from "../../analyserService/enums/SceneType";
import {RunningTimeService} from "../../runningTimeService/RunningTimeService";
import {AnalyserDataImportInterface} from "../../analyserService/interfaces/AnalyserDataImportInterface";
import {AnalyserReportType} from "../../analyserService/enums/AnalyserReportType";
import {LinkSuggesterService} from "../../linkSuggesterService/LinkSuggesterService";
import {SceneDataMetadataInterface} from "../../../components/scene/interfaces/SceneDataMetadataInterface";
import {Component, MarkdownRenderer} from "obsidian";
import {StoryCircleStage} from "../../plotsService/enums/StoryCircleStage";
import {PlotService} from "../../plotsService/PlotService";
import {SorterService} from "../../sorterService/SorterService";
import {SorterComparisonElement} from "../../sorterService/SorterComparisonElement";

export class SceneBuilderModal extends AbstractModal {
	private _scenesContainerEl: HTMLTableSectionElement;
	private _hasEmptyLine = false;
	private _emptyLines: Map<number, boolean>;
	private _idCounter: number;
	private _analyserContainerEl: HTMLDivElement;
	private _createScenesButtonEl: HTMLButtonElement;

	constructor(
		api: RpgManagerApiInterface,
		private _act: ActInterface,
	) {
		super(api);
		this.maxWidth = true;
		this.title = 'Scene Builder';

		this._emptyLines = new Map<number, boolean>();
		this._idCounter = 0;
	}

	onClose() {
		super.onClose();
		this.app.workspace.trigger("rpgmanager:force-refresh-views");
	}

	onOpen() {
		super.onOpen();
		this.modalEl.style.width = 'var(--modal-max-width)';
		this.modalEl.style.minHeight = 'var(--modal-max-height)';

		const editorDeletedContainerEl = this.rpgmContainerEl.createDiv({cls: 'rpg-manager-scene-builder-confirmation'});
		editorDeletedContainerEl.createDiv({text: 'The scenes for ' + this._act.file.basename + ' have been created'});

		const sceneBuilderContainerEl: HTMLDivElement = this.rpgmContainerEl.createDiv({cls: 'rpg-manager-scene-builder'});

		if (this.api.settings.usePlotStructures)
			this._addPlot(sceneBuilderContainerEl);

		this._analyserContainerEl = sceneBuilderContainerEl.createDiv({cls: 'rpg-manager-scene-builder-analyser'});

		const scenesContainerEl = sceneBuilderContainerEl.createDiv({cls: 'scenes-container'});

		const buttonContainerEl: HTMLDivElement = sceneBuilderContainerEl.createDiv({cls: 'rpg-manager-scene-builder-confirmation-button'});
		this._createScenesButtonEl = buttonContainerEl.createEl('button', {text: 'Create Scenes for act ' + this._act.file.basename});
		this._createScenesButtonEl.disabled = true;
		this._createScenesButtonEl.addEventListener('click', () => {
			this._createScenes()
				.then(() => {
					editorDeletedContainerEl.style.display = 'block';
				});
		});

		this._addScenesTable(scenesContainerEl);
	}

	private async _createScenes(
	): Promise<void> {
		let sceneId = 1;
		const scenes = this.api.database.readList<SceneInterface>(ComponentType.Scene, this._act.id);
		await scenes.forEach((scene: SceneInterface) => {
			if (scene.id.sceneId !== undefined && scene.id.sceneId >= sceneId)
				sceneId = scene.id.sceneId + 1;
		});

		let indexOfSelect = 2;

		if (this.api.settings.usePlotStructures)
			indexOfSelect = 3;

		for (let index=0; index<this._scenesContainerEl.rows.length; index++){
			const line = this._scenesContainerEl.rows[index];
			if (line.dataset.id === undefined)
				continue;

			if (this._emptyLines.has(+line.dataset.id) && this._emptyLines.get(+line.dataset.id) === true)
				continue;

			if ((<HTMLInputElement>line.cells[0].childNodes[0]).disabled === true)
				continue;

			let sceneType: SceneType|undefined;

			const type = (<HTMLSelectElement>line.cells[indexOfSelect].childNodes[0]).value;
			if (type !== '')
				sceneType = this.api.service(AnalyserService).getSceneType(type);

			const title = (<HTMLInputElement>line.cells[0].childNodes[0]).value;

			const data: SceneDataMetadataInterface = {
				synopsis: (<HTMLInputElement>line.cells[indexOfSelect-1].childNodes[0]).value,
				sceneType: sceneType !== undefined ? this.api.service(AnalyserService).getReadableSceneType(sceneType) : '',
				isActedUpon: (<HTMLInputElement>line.cells[indexOfSelect+1].childNodes[0]).checked,
			};

			if (this.api.settings.usePlotStructures){
				data.storyCircleStage = (<HTMLSelectElement>line.cells[1].childNodes[0]).value;
			}

			this.api.service(FileCreationService).silentCreate(
				ComponentType.Scene,
				title,
				this._act.id.campaignId,
				this._act.id.adventureId,
				this._act.id.actId,
				sceneId,
				undefined,
				{
					data: data,
				}
			);

			sceneId++;
		}

		this.close();
	}

	private async _refreshAnalyser(
	): Promise<void> {
		this._analyserContainerEl.empty();

		const data: Array<AnalyserDataImportInterface> = [];

		for (let index=0; index<this._scenesContainerEl.rows.length;index++) {
			let indexOfSelect = 2;

			if (this.api.settings.usePlotStructures)
				indexOfSelect = 3;

			const cells: HTMLCollectionOf<HTMLTableCellElement> = this._scenesContainerEl.rows[index].cells;
			const type = (<HTMLSelectElement>cells[indexOfSelect].childNodes[0]).value;
			if (type !== '') {
				const sceneType: SceneType = this.api.service(AnalyserService).getSceneType(type);

				data.push({
					isExciting: (<HTMLInputElement>cells[indexOfSelect + 1].childNodes[0]).checked,
					isActive: sceneType !== undefined ? (activeSceneTypes.get(sceneType) ?? false) : false,
					expectedDuration: sceneType !== undefined ? this.api.service(RunningTimeService).getTypeExpectedDuration(this._act.id.campaignId, sceneType) : 0,
					type: sceneType,
				});
			}
		}

		if (data.length > 0) {
			const analyser = this.api.service(AnalyserService).createBuilder(data, this._act.abtStage);
			analyser.render(AnalyserReportType.SceneBuilder, this._analyserContainerEl);
		}
	}

	private _addSceneLine(
		scene?: SceneInterface,
	): void {
		const id = this._idCounter++;
		const rowEl = this._scenesContainerEl.insertRow();
		rowEl.dataset.id = id.toString();
		this._updateEmptyLines(id, scene === undefined, false, scene === undefined);

		const titleCellEl:HTMLTableCellElement = rowEl.insertCell();
		titleCellEl.addClass('scenes-container-table-title');

		let plotStageSelectionEl: HTMLSelectElement|undefined = undefined;

		if (this.api.settings.usePlotStructures) {
			const plotStageCellEl: HTMLTableCellElement = rowEl.insertCell();
			plotStageCellEl.addClass('scenes-container-table-stage');
			plotStageSelectionEl = plotStageCellEl.createEl('select');
			plotStageSelectionEl.createEl("option", {
				text: '',
				value: '',
			});

			Object.keys(StoryCircleStage).filter((v) => isNaN(Number(v))).forEach((type, index) => {
				if (plotStageSelectionEl !== undefined) {
					const plotStageOption = plotStageSelectionEl.createEl("option", {
						text: type,
						value: type,
					});

					if (scene !== undefined && scene.storyCircleStage !== undefined && scene.storyCircleStage === this.api.service(PlotService).getStoryCircleStage(type)){
						plotStageOption.selected = true;
					}
				}
			});

			if (scene === undefined) {
				plotStageSelectionEl.addEventListener('change', () => {
					this._updateEmptyLines(
						id,
						(
							titleInputEl.value === '' &&
							goalInputEl.value === '' &&
							typeSelectionEl.value === '' &&
							excitementCheckboxEl.checked === false &&
							(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
						),
						true
					);
					this._refreshAnalyser();
				});
			}
		}

		const goalCellEl:HTMLTableCellElement = rowEl.insertCell();
		goalCellEl.addClass('scenes-container-table-goal');

		const typeCellEl:HTMLTableCellElement = rowEl.insertCell();
		typeCellEl.addClass('scenes-container-table-type');

		const excitingCellEl:HTMLTableCellElement = rowEl.insertCell();
		excitingCellEl.addClass('scenes-container-table-exciting');

		const titleInputEl: HTMLInputElement = titleCellEl.createEl('input');
		titleInputEl.type = 'text';

		const goalInputEl: HTMLInputElement = goalCellEl.createEl('input');
		goalInputEl.type = 'text';

		const typeSelectionEl: HTMLSelectElement = typeCellEl.createEl('select');

		const excitementCheckboxEl: HTMLInputElement = excitingCellEl.createEl('input');

		this.api.service(LinkSuggesterService).createHandler(goalInputEl, this._act);

		/** TYPE */
		typeSelectionEl.createEl('option', {text: '', value: ''}).selected = true;

		Object.keys(SceneType).filter((v) => isNaN(Number(v))).forEach((type, index) => {
			const typeOption = typeSelectionEl.createEl("option", {
				text: sceneTypeDescription.get(SceneType[type as keyof typeof SceneType]) ?? type,
				value: type,
			});

			if (scene !== undefined && scene.sceneType !== undefined && scene.sceneType === SceneType[type as keyof typeof SceneType]){
				typeOption.selected = true;
			}
		});

		/** EXCITEMENT */
		excitementCheckboxEl.type = 'checkbox';

		if (scene !== undefined) {
			titleInputEl.value = scene.file.basename;
			titleInputEl.disabled = true;
			goalInputEl.value = scene.synopsis ?? '';
			goalInputEl.disabled = true;
			typeSelectionEl.disabled = true;

			if (scene.isExciting)
				excitementCheckboxEl.checked = true;

			excitementCheckboxEl.disabled = true;
			if (this.api.settings.usePlotStructures && plotStageSelectionEl !== undefined)
				plotStageSelectionEl.disabled = true;

		} else {
			titleInputEl.addEventListener('keyup', () => {
				this._updateEmptyLines(id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
				);
			});

			titleInputEl.addEventListener('focusout', () => {
				this._updateEmptyLines(
					id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
					true,
				);
			});

			goalInputEl.addEventListener('keyup', () => {
				this._updateEmptyLines(
					id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
				);
			});

			goalInputEl.addEventListener('focusout', () => {
				this._updateEmptyLines(
					id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
					true,
				);
			});

			typeSelectionEl.addEventListener('change', () => {
				this._updateEmptyLines(
					id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
					true
				);
				this._refreshAnalyser();
			});

			excitementCheckboxEl.addEventListener('change', () => {
				this._updateEmptyLines(
					id,
					(
						titleInputEl.value === '' &&
						goalInputEl.value === '' &&
						typeSelectionEl.value === '' &&
						excitementCheckboxEl.checked === false &&
						(plotStageSelectionEl === undefined ? true : plotStageSelectionEl.value === '')
					),
					true
				);
				this._refreshAnalyser();
			});
		}
	}

	private _updateEmptyLines(
		lineId: number,
		isEmpty: boolean,
		deleteLine = false,
		addLineIfEmpty = true,
	): void {
		this._emptyLines.set(lineId, isEmpty);

		let emptyLines = 0;
		this._emptyLines.forEach((empty: boolean, id: number) => {
			if (empty === true) emptyLines++;
		});

		if (emptyLines > 1 && deleteLine){
			this._emptyLines.delete(lineId);
			for (let index=0; index<this._scenesContainerEl.rows.length; index++){
				if (this._scenesContainerEl.rows[index].dataset.id === lineId.toString()){
					this._scenesContainerEl.deleteRow(index);
					emptyLines--;
					break;
				}
			}
		}

		this._hasEmptyLine = emptyLines > 0;

		if (!this._hasEmptyLine) {
			this._hasEmptyLine = true;
			if (addLineIfEmpty)
				this._addSceneLine();

		}

		this._createScenesButtonEl.disabled = (this._scenesContainerEl.rows.length < 2);
	}

	private _addScenesTable(
		containerEl: HTMLDivElement,
	): void {
		const scenesTableEl: HTMLTableElement = containerEl.createEl('table');
		const titleTHeadEl: HTMLTableSectionElement = scenesTableEl.createTHead();
		const titleRowEl: HTMLTableRowElement = titleTHeadEl.insertRow();
		const titleCellEl: HTMLTableCellElement = titleRowEl.insertCell();
		titleCellEl.textContent = 'Title';
		titleCellEl.addClass('scenes-container-table-title');

		if (this.api.settings.usePlotStructures) {
			const plotStageCellEl: HTMLTableCellElement = titleRowEl.insertCell();
			plotStageCellEl.textContent = 'Stage';
			plotStageCellEl.addClass('scenes-container-table-stage');
		}


		const goalCellEl: HTMLTableCellElement = titleRowEl.insertCell();
		goalCellEl.textContent = 'Goal';
		goalCellEl.addClass('scenes-container-table-goal');

		const typeCellEl: HTMLTableCellElement = titleRowEl.insertCell();
		typeCellEl.textContent = 'Type';
		typeCellEl.addClass('scenes-container-table-type');

		const excitingCellEl: HTMLTableCellElement = titleRowEl.insertCell();
		excitingCellEl.textContent = 'Exciting?';
		excitingCellEl.addClass('scenes-container-table-exciting');

		this._scenesContainerEl = scenesTableEl.createTBody();

		const scenes = this.api.database.readList<SceneInterface>(ComponentType.Scene, this._act.id)
			.sort(this.api.service(SorterService).create<SceneInterface>([
				new SorterComparisonElement((scene: SceneInterface) => scene.id.id),
			]));
		if (scenes.length > 0){
			for (let index=0; index<scenes.length; index++){
				this._addSceneLine(scenes[index]);
			}

			this._refreshAnalyser();
		}

		this._addSceneLine();
	}

	private _addPlot(
		containerEl: HTMLDivElement,
	): void {
		const plotContainerEl: HTMLDivElement = containerEl.createDiv({cls: 'rpg-manager-scene-builder-plot'});

		this._addPlotElement('You', this._act.storyCircle.you, plotContainerEl);
		this._addPlotElement('Need', this._act.storyCircle.need, plotContainerEl);
		this._addPlotElement('Go', this._act.storyCircle.go, plotContainerEl);
		this._addPlotElement('Search', this._act.storyCircle.search, plotContainerEl);
		this._addPlotElement('Find', this._act.storyCircle.find, plotContainerEl);
		this._addPlotElement('Take', this._act.storyCircle.take, plotContainerEl);
		this._addPlotElement('Return', this._act.storyCircle.return, plotContainerEl);
		this._addPlotElement('Change', this._act.storyCircle.change, plotContainerEl);
	}

	private _addPlotElement(
		title: string,
		content: string,
		containerEl: HTMLDivElement,
	): void {
		const plotContainerEl: HTMLDivElement = containerEl.createDiv({cls:'rpg-manager-scene-builder-plot-line clearfix'});

		plotContainerEl.createDiv({cls: 'rpg-manager-scene-builder-plot-line-title', text: title});
		const plotContentEl: HTMLDivElement = plotContainerEl.createDiv({cls: 'rpg-manager-scene-builder-plot-line-description'});

		MarkdownRenderer.renderMarkdown(
			content,
			plotContentEl,
			'',
			null as unknown as Component,
		);
	}
}
