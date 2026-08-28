/**
 * Credits: The OpenUwU Project
 * Author:  @bre4d777
 * github.com/openUwU/
 */

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
