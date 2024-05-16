import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateAddress } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { BsPencil } from "react-icons/bs";

const selectAddresses = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.addresses || []
);

function AddressUpdate({ address }) {
  const addresses = useSelector(selectAddresses);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !addresses.some(
              (ad) => ad.label === value && ad.nanoId !== address.nanoId
            )
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
    defaultValues: address,
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    clearErrors("publicKey");
    try {
      await dispatch(updateAddress({ ...address, ...data })).unwrap();
    } catch (error) {
      console.error("Failed to update address:", error);
    }
    handleClose();
  };

  return (
    <>
      <BsPencil className="cursor-pointer text-primary" onClick={handleShow} />

      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Edit Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)} className="text-start">
            <Form.Group className="mb-3" controlId="updateFormLabel">
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

            <Form.Group className="mb-3" controlId="updateFormPublicKey">
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

      {/* <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="updateFormLabel">
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

        <Form.Group className="mb-3" controlId="updateFormPublicKey">
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
          Update Address
        </Button>
      </Form> */}
    </>
  );
}

AddressUpdate.propTypes = {
  address: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default AddressUpdate;
