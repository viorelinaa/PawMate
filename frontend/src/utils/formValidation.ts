export type ManagedFormField =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type FormErrors = Record<string, string>;

export const PHONE_PATTERN = "\\d{8,15}";
export const PHONE_HINT = "Introdu doar cifre, intre 8 si 15 caractere.";

function isManagedFormField(element: Element): element is ManagedFormField {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
}

export function getFieldKey(field: ManagedFormField): string {
  return field.name || field.id || "";
}

export function getFieldValidationMessage(field: ManagedFormField): string | null {
  const rawValue = "value" in field ? field.value : "";
  const value = typeof rawValue === "string" ? rawValue.trim() : "";

  if (field.disabled) return null;

  if (field instanceof HTMLInputElement && field.type === "checkbox") {
    if (field.required && !field.checked) {
      return "Bifeaza acest camp obligatoriu.";
    }
    return null;
  }

  if (field.required && value === "") {
    return "Completeaza acest camp obligatoriu.";
  }

  if (value === "") return null;

  if (field.validity.typeMismatch) {
    if (field instanceof HTMLInputElement && field.type === "email") {
      return "Introdu o adresa de email valida.";
    }

    return "Verifica formatul campului.";
  }

  if (field.validity.badInput) {
    if (field instanceof HTMLInputElement && field.type === "number") {
      return "Introdu un numar valid.";
    }

    return "Completeaza corect acest camp.";
  }

  if (field.validity.patternMismatch) {
    if (field instanceof HTMLInputElement && field.type === "tel") {
      return "Introdu doar cifre, intre 8 si 15 caractere.";
    }

    return "Valoarea introdusa nu are formatul corect.";
  }

  if (
    field instanceof HTMLInputElement &&
    field.validity.rangeUnderflow &&
    field.min
  ) {
    return `Valoarea minima este ${field.min}.`;
  }

  if (
    field instanceof HTMLInputElement &&
    field.validity.rangeOverflow &&
    field.max
  ) {
    return `Valoarea maxima este ${field.max}.`;
  }

  if (
    (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) &&
    field.validity.tooShort &&
    field.minLength > 0
  ) {
    return `Introdu cel putin ${field.minLength} caractere.`;
  }

  if (
    (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) &&
    field.validity.tooLong &&
    field.maxLength > 0
  ) {
    return `Introdu cel mult ${field.maxLength} caractere.`;
  }

  return null;
}

export function collectFormValidationErrors(form: HTMLFormElement): {
  errors: FormErrors;
  firstInvalidElement: ManagedFormField | null;
} {
  const errors: FormErrors = {};
  let firstInvalidElement: ManagedFormField | null = null;

  for (const element of Array.from(form.elements)) {
    if (!(element instanceof Element) || !isManagedFormField(element)) continue;

    const key = getFieldKey(element);
    if (!key) continue;

    const message = getFieldValidationMessage(element);
    if (!message) continue;

    errors[key] = message;
    if (!firstInvalidElement) {
      firstInvalidElement = element;
    }
  }

  return { errors, firstInvalidElement };
}

export function updateSingleFieldError(
  field: ManagedFormField,
  previousErrors: FormErrors
): FormErrors {
  const key = getFieldKey(field);
  if (!key) return previousErrors;

  const nextErrors = { ...previousErrors };
  const message = getFieldValidationMessage(field);

  if (message) {
    nextErrors[key] = message;
  } else {
    delete nextErrors[key];
  }

  return nextErrors;
}
