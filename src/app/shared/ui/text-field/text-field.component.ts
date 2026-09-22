import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent, IconName } from '../icon/icon.component';

let nextId = 0;

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor {
  readonly label = input<string>('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly placeholder = input('');
  readonly helper = input('');
  readonly icon = input<IconName | null>(null);
  readonly autocomplete = input('off');
  readonly maxlength = input<number | null>(null);
  readonly errorText = input<string | null>(null);

  readonly id = `text-field-${nextId++}`;
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly showPassword = signal(false);
  readonly touched = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get effectiveType(): string {
    if (this.type() !== 'password') return this.type();
    return this.showPassword() ? 'text' : 'password';
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(value: string): void {
    this.value.set(value);
    this.onChange(value);
  }

  handleBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((v) => !v);
  }
}
