import { Expression } from 'regexp-tree/ast';
import { expandAlternative } from './helpers/alternative-pattern';
import { expandChar } from './helpers/char-pattern';
import { expandCharacterClass } from './helpers/character-class-pattern';
import { expandDisjunction } from './helpers/disjunction-pattern';
import { expandBackreference, expandGroup } from './helpers/group-pattern';
import { iterateWithSorting } from './helpers/iterate-sorted';
import { expandRepetition } from './helpers/repetition-pattern';
import sortRandom from './sorts/fisher-yates-random';
import * as Guards from './types/regexp-tree-guards';

/* istanbul ignore next */
function assertNever(x: never): never {
	throw new Error('Unexpected node type: ' + x);
}

class Expander {
	protected expandAlternative = expandAlternative;
	protected expandBackreference = expandBackreference;
	protected expandChar = expandChar;
	protected expandCharacterClass = expandCharacterClass;
	protected expandDisjunction = expandDisjunction;
	protected expandGroup = expandGroup;
	protected expandRepetition = expandRepetition;

	protected iterateWithSorting = iterateWithSorting;

	/**
	 * Create a generator for strings that match regular expression
	 * patterns parsed by regexp-tree.
	 * @param flags The regular expression modifier flags
	 * @param sort An optional function for sorting variations during parsing.
	 *             When omitted, variations are returned randomly.
	 */
	constructor(
		protected readonly flags: string,
		protected readonly sort: <T>(options: T[]) => T[] = sortRandom
	) {}

	/**
	 * Identify and expand an expression of any type.
	 * @param expression The expression to expand
	 * @returns An iterator that yields strings matched by expression
	 */
	public *expandExpression(
		this: Expander,
		expression: Expression | null
	): IterableIterator<string> {
		if (expression === null) {
			yield '';
		} else if (Guards.isAlternative(expression)) {
			yield* this.expandAlternative(expression);
		} else if (Guards.isAssertion(expression)) {
			yield '';
		} else if (Guards.isBackreference(expression)) {
			yield* this.expandBackreference(expression);
		} else if (Guards.isChar(expression)) {
			yield* this.expandChar(expression);
		} else if (Guards.isCharacterClass(expression)) {
			yield* this.expandCharacterClass(expression);
		} else if (Guards.isDisjunction(expression)) {
			yield* this.expandDisjunction(expression);
		} else if (Guards.isGroup(expression)) {
			yield* this.expandGroup(expression);
		} else if (Guards.isRepetition(expression)) {
			yield* this.expandRepetition(expression);
		} else {
			/* istanbul ignore next */
			assertNever(expression);
		}
	}
}

export default Expander;
