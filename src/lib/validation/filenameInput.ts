// Input validation/sanitization for the raw text the user types or pastes.
// Kept deliberately permissive -- almost any string is a "valid" filename to
// inspect -- but guards against pathological input (huge pastes, control
// characters) before it reaches parsing/rendering.

export const MAX_INPUT_LENGTH = 512;

export interface ValidatedInput {
  /** Cleaned value safe to parse and display. */
  value: string;
  /** Set when the input was altered or is unusual, to show the user a small inline note. */
  warning: string | null;
}

const CONTROL_CHARS_PATTERN = new RegExp("[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]", "g");

export function validateFilenameInput(raw: string): ValidatedInput {
  // Strip control/non-printable characters. Tab, newline and carriage return are left
  // for parseFilename's own .trim() to handle naturally.
  const withoutControlChars = raw.replace(CONTROL_CHARS_PATTERN, "");

  let warning: string | null = null;
  let value = withoutControlChars;

  if (value.length > MAX_INPUT_LENGTH) {
    value = value.slice(0, MAX_INPUT_LENGTH);
    warning = `Input was longer than ${MAX_INPUT_LENGTH} characters and was trimmed.`;
  }

  if (withoutControlChars.length !== raw.length && !warning) {
    warning = "Unsupported characters were removed from your input.";
  }

  return { value, warning };
}
