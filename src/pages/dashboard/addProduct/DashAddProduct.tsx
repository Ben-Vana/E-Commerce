import FormComponent from "../../../components/FormComponent";
import { useRef, useState } from "react";
import "./dashform.css";

interface formInterface {
  formName: string;
  formRef: React.RefObject<HTMLLabelElement>;
}

interface infoInterface {
  name: string;
  description: string;
  price: string;
  quantity: string;
  image: string;
}

const DashAddProduct = (): JSX.Element => {
  const [productInfo, setProductInfo] = useState<infoInterface>({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
  });

  const nameLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const descriptionLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const priceLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const quantityLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const imageLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const formLabels: formInterface[] = [
    { formName: "name", formRef: nameLabel },
    { formName: "description", formRef: descriptionLabel },
    { formName: "price", formRef: priceLabel },
    { formName: "quantity", formRef: quantityLabel },
    { formName: "image", formRef: imageLabel },
  ];

  const handleFocus = (labelName: string): void => {
    const label = formLabels.find((item) => item.formName === labelName);
    label &&
      label.formRef.current &&
      label.formRef.current.classList.add("input-label-active");
  };

  const handleBlur = (
    ev: React.FocusEvent<HTMLInputElement>,
    labelName: string
  ): void => {
    const label = formLabels.find((item) => item.formName === labelName);
    !ev.target.value &&
      label &&
      label.formRef.current &&
      label.formRef.current.classList.remove("input-label-active");
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    let tempInfo = JSON.parse(JSON.stringify(productInfo));
    tempInfo[ev.target.id] = ev.target.value;
    setProductInfo(tempInfo);
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    console.log(productInfo);
  };

  return (
    <div className="form-wrapper dash-wrapper">
      <form
        className="form-container dash-form-container"
        onSubmit={handleSubmit}
      >
        {formLabels.map((item, index) => (
          <FormComponent
            key={index + item.formName}
            formLabel={item.formName}
            reactRef={item.formRef}
            blur={handleBlur}
            focus={handleFocus}
            change={handleInputChange}
            inputValue={productInfo[item.formName as keyof infoInterface]}
          />
        ))}
        <button>submit</button>
      </form>
    </div>
  );
};

export default DashAddProduct;
