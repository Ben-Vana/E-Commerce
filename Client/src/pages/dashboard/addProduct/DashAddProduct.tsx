import axios from "axios";
import FormComponent from "../../../components/FormComponent";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

const DashAddProduct = (): JSX.Element => {
  const [productInfo, setProductInfo] = useState<infoInterface>({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [productImages, setImages] = useState<FileList | null>(null);

  const [error, setError] = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  const navigate = useNavigate();

  const nameLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const priceLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const quantityLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const imageLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const formLabels: formInterface[] = [
    { formName: "name", formRef: nameLabel },
    { formName: "price", formRef: priceLabel },
    { formName: "quantity", formRef: quantityLabel },
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

  const handleFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      let oversize = false;
      for (let i = 0; i < ev.target.files.length; i++) {
        if (ev.target.files[i].size > 1048576) {
          oversize = true;
          break;
        }
      }
      if (oversize) {
        setSizeErr(true);
        setImages(null);
      } else {
        setImages(ev.target.files);
        setSizeErr(false);
      }
    }
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (productImages && !sizeErr) {
      const formData = new FormData();
      for (let i = 0; i < productImages.length; i++)
        formData.append("images", productImages[i]);
      const tempProduct = JSON.parse(JSON.stringify(productInfo));
      tempProduct.description = productInfo.description
        .replace(/,/g, "{commaREPLACE}")
        .split(/\n+/);
      const fields = Object.keys(tempProduct);
      for (const field of fields) formData.append(field, tempProduct[field]);
      axios
        .post("/product", formData)
        .then(({ data }) => navigate(`/product?pid=${data._id}`))
        .catch(() => setError(true));
    }
  };

  return (
    <div className="form-wrapper dash-wrapper">
      <form
        className="form-container dash-form-container"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="dash-input-container">
          {formLabels.map((item, index) => (
            <FormComponent
              key={index + item.formName}
              formLabel={item.formName}
              reactRef={item.formRef}
              blur={handleBlur}
              focus={handleFocus}
              change={handleInputChange}
              inputValue={productInfo[item.formName as keyof infoInterface]}
              edit={false}
            />
          ))}
          <div className="input-container">
            <label className="file-label" ref={imageLabel} htmlFor="images">
              Image:
            </label>
            <input
              style={{ paddingRight: "1.5rem" }}
              className="file-input"
              type="file"
              id="images"
              onChange={handleFileChange}
              multiple
              required
            />
          </div>
          {error && (
            <div className="submit-error">
              *Server Error Please Try Again Later.
            </div>
          )}
          {sizeErr && (
            <div className="submit-error">*File size is too big.</div>
          )}
          <button className="product-submit hide">Add Product</button>
        </div>
        <div className="text-area-desc">
          <label className="text-area-head" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className="text-area-style"
            value={productInfo.description}
            onChange={(ev: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleInputChange(ev)
            }
            required
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
        <button className="product-submit show">Add Product</button>
      </form>
    </div>
  );
};

export default DashAddProduct;
