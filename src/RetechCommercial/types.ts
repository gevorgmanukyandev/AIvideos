export type SceneId =
	| 'hook'
	| 'panic'
	| 'branding'
	| 'vehicleArrival'
	| 'repair-01-receive'
	| 'repair-02-tools'
	| 'repair-03-open'
	| 'repair-04-replace'
	| 'repair-05-test'
	| 'repair-06-poweron'
	| 'relief'
	| 'brandEnding';

export type SceneDefinition = {
	id: SceneId;
	durationInFrames: number;
};
