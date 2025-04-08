/**
 * Generates a unique label for the GitHub runner.
 * Combines a compact timestamp and a random suffix to avoid collisions.
 *
 * @returns A unique label string.
 */
export function generateLabel(): string {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14); // yyyyMMddHHmmss
  const randomSuffix = Math.random().toString(36).substring(2, 6); // 4 random alphanum chars

  // Combine timestamp and random suffix to create a unique label.
  return `github-runner-${timestamp}-${randomSuffix}`;
}
