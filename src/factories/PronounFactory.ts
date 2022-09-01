import {Pronoun} from "../enums/Pronoun";

export class PronounFactory {
	public static create(
		pronoun: string|null,
	): Pronoun|null {

		let response: Pronoun|null = null;

		if (pronoun != null) {
			switch(pronoun.toLowerCase()) {
				case 't':
				case 'they':
					response = Pronoun.they;
					break;
				case 's':
				case 'she':
					response = Pronoun.she;
					break;
				case 'h':
				case 'he':
					response = Pronoun.he;
					break;
				default:
					response = null;
					break;
			}
		}

		return response;
	}

	public static readPronoun(
		pronoun: Pronoun
	): string {
		switch (pronoun) {
			case Pronoun.they:
				return 'They/Them';
				break;
			case Pronoun.she:
				return 'She/Her';
				break;
			case Pronoun.he:
				return 'He/Him';
				break;
		}
	}
}