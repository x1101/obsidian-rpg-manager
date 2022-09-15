import {CampaignSetting} from "../../enums/CampaignSetting";

export interface BaseCampaignInterface {
	campaignId: number;
	currentDate: Date|null;
	settings: CampaignSetting;
	link: string;

	get name(): string;
	get image(): string|null;
}
