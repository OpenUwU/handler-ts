/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

const emojiDictionary = {} as const;

/** * Extracted type of valid emoji names based on the dictionary keys.
 */
export type EmojiName = keyof typeof emojiDictionary;

/**
 * The emoji utility object.
 */
export const emoji = {
	/**
	 * Retrieves a  emoji by its name.
	 * * @param name - The key of the emoji defined in `emojiDictionary`.
	 * @returns The Discord formatted emoji string. Returns a fallback "❓" if somehow bypassed.
	 */
	get(name: EmojiName): string {
		return emojiDictionary[name] ?? "❓";
	},
};
