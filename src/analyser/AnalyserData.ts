import {AnalyserDataInterface} from "./interfaces/AnalyserDataInterface";
import {SceneType} from "../components/enums/SceneType";

export class AnalyserData implements AnalyserDataInterface {
	public dataLength = 0;
	public totalRunningTime = 0;
	public totalActiveScenes = 0;
	public totalRepetitiveScenes = 0;
	public totalExpectedRunningTime = 0;
	public totalExpectedExcitmentDuration = 0;
	public totalTargetDuration = 0;
	public dataTypeUsed: Map<SceneType, number> = new Map<SceneType, number>();

	private previousType: SceneType|undefined = undefined;

	get totalExcitementPercentage(): number {
		return Math.floor(this.totalExpectedExcitmentDuration * 100 / this.totalExpectedRunningTime);
	}

	get totalActivityPercentage(): number {
		return Math.floor(this.totalActiveScenes * 100 / this.dataLength)
	}

	get isValid(): boolean {
		return this.dataLength !== 0;
	}

	set dataCount(count: number) {
		this.dataLength = count;
	}

	public addExpectedRunningTime(
		duration: number
	): void {
		this.totalExpectedRunningTime += duration;
	}

	public addExpectedExcitmentDuration(
		duration: number,
	): void {
		this.totalExpectedExcitmentDuration += duration;
	}

	public addActiveScene(
	): void {
		this.totalActiveScenes++;
	}

	addSceneType(
		type: SceneType|undefined,
	): void {
		if (type !== undefined) {
			this.dataTypeUsed.set(type, (this.dataTypeUsed.get(type) ?? 0) + 1);
			if (this.previousType === type) {
				this.totalRepetitiveScenes++;
			} else {
				this.previousType = type;
			}
		}
	}
}