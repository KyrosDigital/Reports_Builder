export interface Account {
	_id: string | null | undefined; // the mongoId of the report object
	name: string;
	created_at: Date
}