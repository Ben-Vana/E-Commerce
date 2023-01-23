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

  const [productImages, setImages] = useState<Array<string>>([]);

  const [error, setError] = useState({ imgErr: false, formErr: false });
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
    if (labelName === "image" && imageLabel.current)
      imageLabel.current.classList.add("input-label-active");
    else {
      const label = formLabels.find((item) => item.formName === labelName);
      label &&
        label.formRef.current &&
        label.formRef.current.classList.add("input-label-active");
    }
  };

  const handleBlur = (
    ev: React.FocusEvent<HTMLInputElement>,
    labelName: string
  ): void => {
    if (labelName === "image" && !ev.target.value && imageLabel.current)
      imageLabel.current.classList.remove("input-label-active");
    else {
      const label = formLabels.find((item) => item.formName === labelName);
      !ev.target.value &&
        label &&
        label.formRef.current &&
        label.formRef.current.classList.remove("input-label-active");
    }
  };

  const handleInputChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    let tempInfo = JSON.parse(JSON.stringify(productInfo));
    tempInfo[ev.target.id] = ev.target.value;
    setProductInfo(tempInfo);
  };

  const handleAddImage = (): void => {
    if (!productInfo.image) return;
    let tempImageArr = JSON.parse(JSON.stringify(productImages));
    const tempProduct = JSON.parse(JSON.stringify(productInfo));
    tempImageArr.unshift(productInfo.image);
    setImages(tempImageArr);
    tempProduct.image = "";
    setProductInfo(tempProduct);
  };

  const handleDeleteImage = (id: string): void => {
    const removeIndex = productImages.findIndex((item) => item === id);
    const tempImagesArr = JSON.parse(JSON.stringify(productImages));
    const newImagesArr = tempImagesArr
      .slice(0, removeIndex)
      .concat(tempImagesArr.slice(removeIndex + 1));
    setImages(newImagesArr);
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (!productImages[0]) {
      setError((state) => {
        return { imgErr: true, formErr: state.formErr };
      });
      return;
    }
    const tempProduct = JSON.parse(JSON.stringify(productInfo));
    tempProduct.description = productInfo.description.split(/\n+/);
    tempProduct.image = productImages;
    axios
      .post("/product", {
        name: tempProduct.name,
        description: tempProduct.description,
        price: tempProduct.price,
        quantity: +tempProduct.quantity,
        image: tempProduct.image,
      })
      .then(({ data }) => navigate(`/product?pid=${data._id}`))
      .catch(() =>
        setError((state) => {
          return { imgErr: state.imgErr, formErr: true };
        })
      );
  };

  return (
    <div className="form-wrapper dash-wrapper">
      <form
        className="form-container dash-form-container"
        onSubmit={handleSubmit}
        encType=""
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
            <label className="input-label" ref={imageLabel} htmlFor="image">
              Image:
            </label>
            <input
              style={{ paddingRight: "1.5rem" }}
              className="form-input dash-form-input"
              type="text"
              id="image"
              onFocus={() => handleFocus("image")}
              onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
                handleBlur(ev, "image")
              }
              onChange={handleInputChange}
              value={productInfo.image}
              minLength={2}
              maxLength={1024}
            />
            <span
              className="add-img"
              title="Add image"
              onClick={handleAddImage}
            >
              +
            </span>
          </div>
          {error.imgErr && (
            <div className="submit-error">
              *Make sure you pressed the plus button to upload the image.
            </div>
          )}
          {error.formErr && (
            <div className="submit-error">
              *Error has occured, Please try again later.
            </div>
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
          <div className="add-img-container">
            {productImages[0] &&
              productImages.map((item, index) => (
                <div key={index} className="img-frame">
                  <img
                    src={item}
                    alt={productInfo.name}
                    className="added-img"
                  />
                  <span
                    className="remove-img"
                    onClick={() => handleDeleteImage(item)}
                  >
                    +
                  </span>
                </div>
              ))}
          </div>
        </div>
        <button className="product-submit show">Add Product</button>
      </form>
    </div>
  );
};

export default DashAddProduct;
