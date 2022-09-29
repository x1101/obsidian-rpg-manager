import {ComponentInterface} from "../database/ComponentInterface";
import {AdventureInterface} from "./AdventureInterface";
import {ActInterface} from "./ActInterface";
import {SessionInterface} from "./SessionInterface";
import {StoryCircleStage} from "../../enums/StoryCircleStage";
import {SceneType} from "../../enums/SceneType";

export interface SceneInterface extends ComponentInterface {
	sceneId: number;
	sessionId: number | undefined;
	action: string | null;
	startTime: Date | null;
	endTime: Date | null;
	date: Date | null;

	storycircleStage: StoryCircleStage | undefined;
	sceneType: SceneType | undefined;
	isActedUpon: boolean | undefined;

	adventure: AdventureInterface;
	session: SessionInterface | undefined;
	act: ActInterface;
	previousScene: SceneInterface | null;
	nextScene: SceneInterface | null;

	currentDuration: number;

	get duration(): string;

	get isActive(): boolean;

	get expectedDuration(): number;

	get isExciting(): boolean

	get isCurrentlyRunning(): boolean;

	get lastStart(): number;
}
