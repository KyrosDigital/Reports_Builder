export interface Account {
	_id: string | null | undefined; // the mongoId of the report object
	name: string;
	created_at: Date
}

export interface Viewer {
	_id: string;
	username: string;
	emails: Array<ViewerEmail>;
	tags: Array<string>;
	profile: {
		first_name: string;
		last_name: string;
		viewer_id: string;
		[key: string]: string | number | Object | null | undefined;
	}
}

export interface ViewerEmail {
	address: string;
	verified: boolean;
}