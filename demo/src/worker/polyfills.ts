// From options at https://github.com/wessberg/polyfiller#feature-names
const featuresToPolyfill = [
	'es.array.fill',
	'es.array.includes',
	'es.array.iterator',
	'es.number.is-finite',
	'es.number.is-integer',
	'es.object.assign',
	'es.string.code-point-at',
	'es.string.from-code-point',
	'es.string.includes',
	'es.string.iterator',
	'es.symbol.iterator',
].join(',');

// @ts-expect-error worker-specific function that is unrecognized
importScripts(
	`https://polyfill.app/api/polyfill?features=${featuresToPolyfill}&context=worker`
);
