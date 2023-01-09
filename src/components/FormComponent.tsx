interface formProps {
  formLabel: string;
  reactRef: React.RefObject<HTMLLabelElement>;
  blur: Function;
  focus: Function;
  change: Function;
  inputValue: string;
}

const FormComponent = ({
  formLabel,
  reactRef,
  blur,
  focus,
  change,
  inputValue,
}: formProps): JSX.Element => {
  return (
    <div className="input-container">
      <label className="input-label" ref={reactRef} htmlFor={formLabel}>
        {formLabel.charAt(0).toUpperCase() + formLabel.slice(1)}:
      </label>
      <input
        className="form-input dash-form-input"
        type="text"
        id={formLabel}
        onFocus={(): void => focus(formLabel)}
        onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
          blur(ev, formLabel)
        }
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => change(ev)}
        value={inputValue}
        required
      />
    </div>
  );
};

export default FormComponent;
