import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

const formatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Currency input: MXN, structurally blocks negative values, formats with thousands separators on blur. */
@Component({
  selector: 'app-money-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './money-field.component.html',
  styleUrl: './money-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MoneyFieldComponent),
      multi: true,
    },
  ],
})
export class MoneyFieldComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly helper = input('');
  readonly errorText = input<string | null>(null);
  readonly placeholder = input('0.00');

  readonly id = `money-field-${nextId++}`;
  readonly rawValue = signal<number | null>(null);
  readonly displayValue = signal('');
  readonly focused = signal(false);
  readonly disabled = signal(false);
  readonly touched = signal(false);

  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: number | null): void {
    this.rawValue.set(value);
    this.syncDisplay();
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleFocus(): void {
    this.focused.set(true);
    this.displayValue.set(this.rawValue() === null ? '' : String(this.rawValue()));
  }

  handleInput(raw: string): void {
    // Structurally block anything but digits and a single decimal point — negative is unreachable.
    const sanitized = raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    this.displayValue.set(sanitized);
    const parsed = sanitized === '' ? null : Number(sanitized);
    this.rawValue.set(parsed !== null && Number.isNaN(parsed) ? null : parsed);
    this.onChange(this.rawValue());
  }

  handleBlur(): void {
    this.focused.set(false);
    this.touched.set(true);
    this.syncDisplay();
    this.onTouched();
  }

  private syncDisplay(): void {
    const value = this.rawValue();
    this.displayValue.set(value === null ? '' : formatter.format(value));
  }
}
