interface formProps {
  formLabel: string;
  reactRef: React.RefObject<HTMLLabelElement>;
  blur: Function;
  focus: Function;
  change: Function;
  inputValue: string;
  edit: boolean;
}

const FormComponent = ({
  formLabel,
  reactRef,
  blur,
  focus,
  change,
  inputValue,
  edit,
}: formProps): JSX.Element => {
  return (
    <div className="input-container">
      <label
        className={edit ? "input-label-active input-label" : "input-label"}
        ref={reactRef}
        htmlFor={formLabel}
      >
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
        pattern={
          formLabel === "quantity" || formLabel === "price" ? "^[0-9]+$" : ".*"
        }
        minLength={2}
        maxLength={1024}
        required
      />
    </div>
  );
};

export default FormComponent;
