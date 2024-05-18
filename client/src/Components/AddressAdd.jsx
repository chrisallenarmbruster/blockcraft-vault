import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAddress } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsPersonAdd } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressAdd() {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    reset();
    setShow(false);
  };
  const handleShow = () => setShow(true);

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
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(addAddress(data)).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
  };

  return (
    <>
      <BsPersonAdd
        className="cursor-pointer text-primary"
        onClick={handleShow}
      />
      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Add Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
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
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                />
                <Button variant="outline-secondary" className="rounded-right">
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddressAdd;
