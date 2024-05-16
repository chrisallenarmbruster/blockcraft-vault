import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { addEntry } from "../store/entriesSlice";
import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const schema = yup.object().shape({
  from: yup.string().matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
  privateKey: yup.string().required("Private key is required"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer"),
  to: yup.string().matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
});

function EntryAdd({ show, handleClose }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();

  const [selectedPrivateKey, setSelectedPrivateKey] = useState("");

  const addresses = useSelector(
    (state) => state.data.unencryptedData?.addresses || []
  );

  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];

  useEffect(() => {
    if (show) {
      setSelectedPrivateKey("");
      reset();
    }
  }, [show, reset]);

  useEffect(() => {
    setValue("privateKey", selectedPrivateKey);
  }, [selectedPrivateKey, setValue]);

  const onSubmit = async (data) => {
    clearErrors("from");
    try {
      await dispatch(addEntry(data)).unwrap();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add entry", error.message);
      } else {
        console.error("An unknown error occurred while adding the entry");
      }
    }
    handleClose();
  };

  const handleSelectChange = (event) => {
    const selectedKeypair = keypairs.find(
      (keypair) => keypair.publicKey === event.target.value
    );
    setSelectedPrivateKey(selectedKeypair ? selectedKeypair.privateKey : "");
  };

  return (
    <>
      <Modal
        centered
        show={show}
        onHide={handleClose}
        contentClassName="dark-modal"
      >
        <Modal.Header>
          <Modal.Title>Send Assets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formFrom">
              <Form.Label>From</Form.Label>
              <Form.Select
                {...register("from")}
                isInvalid={!!errors.from}
                onChange={handleSelectChange}
              >
                <option value="">Select a keypair</option>
                {keypairs.map((keypair, index) => (
                  <option key={index} value={keypair.publicKey}>
                    {keypair.label} - {keypair.publicKey.slice(0, 4)}...
                    {keypair.publicKey.slice(-4)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.from?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrivateKey">
              <Form.Control
                type="hidden"
                {...register("privateKey")}
                value={selectedPrivateKey}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTo">
              <Form.Label>To</Form.Label>
              <Form.Select {...register("to")} isInvalid={!!errors.to}>
                <option value="">Select a contact</option>
                {addresses.map((address, index) => (
                  <option key={index} value={address.publicKey}>
                    {address.label} - {address.publicKey.slice(0, 4)}...
                    {address.publicKey.slice(-4)}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.to?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                {...register("amount")}
                isInvalid={!!errors.amount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount?.message}
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
            Send
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

EntryAdd.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EntryAdd;
