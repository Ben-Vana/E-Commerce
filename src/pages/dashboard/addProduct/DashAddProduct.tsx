import FormComponent from "../../../components/FormComponent";
import { useRef, useState } from "react";
import "./dashform.css";
import axios from "axios";

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
  const priceLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const quantityLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const imageLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const formLabels: formInterface[] = [
    { formName: "name", formRef: nameLabel },
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

  const handleInputChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    let tempInfo = JSON.parse(JSON.stringify(productInfo));
    tempInfo[ev.target.id] = ev.target.value;
    setProductInfo(tempInfo);
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    const tempProduct = JSON.parse(JSON.stringify(productInfo));
    tempProduct.description = productInfo.description.split(/\n/);
    tempProduct.quantity = +tempProduct.quantity;
    axios
      .post("/product", tempProduct)
      .then(() => console.log("good"))
      .catch((error) => console.log(error));
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
      <div className="text-area-desc">
        <div className="text-area-head">Description:</div>
        <textarea
          id="description"
          className="text-area-style"
          value={productInfo.description}
          onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange(ev)
          }
        />
        <div className="text-area-info">
          <span style={{ textDecoration: "underline", fontSize: "1.2rem" }}>
            Note
          </span>
          : For a better description in the product page, please separate the
          text to different paragraphs by going down one line between each
          paragraph.
        </div>
      </div>
    </div>
  );
};

export default DashAddProduct;
