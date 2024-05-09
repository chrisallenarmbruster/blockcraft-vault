import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { useNavigate } from "react-router-dom";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressAdd() {
  const navigate = useNavigate();
  const addresses = useSelector(selectAddresses);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) => !addresses.some((address) => address.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(addAddress(data)).unwrap();
      navigate("/addresses");
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formLabel">
        <Form.Label>Label</Form.Label>
        <Form.Control
          type="text"
          {...register("label")}
          isInvalid={!!errors.label}
        />
        <Form.Control.Feedback type="invalid">
          {errors.label?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPublicKey">
        <Form.Label>Public Key</Form.Label>
        <Form.Control
          type="text"
          {...register("publicKey")}
          isInvalid={!!errors.publicKey}
        />
        <Form.Control.Feedback type="invalid">
          {errors.publicKey?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Address
      </Button>
    </Form>
  );
}

export default AddressAdd;
