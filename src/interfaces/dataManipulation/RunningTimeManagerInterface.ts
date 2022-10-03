import {SceneType} from "../../enums/SceneType";
import {SceneInterface} from "../../database/components/interfaces/SceneInterface";

export interface RunningTimeManagerInterface{
	currentlyRunningScene: SceneInterface|undefined;
	medianTimes: Map<number, Map<SceneType, Array<number>>>;

	get isTimerRunning(): boolean;

	isCurrentlyRunningScene(
		scene: SceneInterface,
	): boolean;

	startScene(
		scene: SceneInterface,
	): Promise<void>;

	stopScene(
		scene: SceneInterface,
	): Promise<void>;

	updateMedianTimes(
		isStartup?: boolean,
	): Promise<void>;
}
