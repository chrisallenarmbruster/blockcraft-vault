import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addKeypair } from "../store/dataSlice";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { BsNodePlus } from "react-icons/bs";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function KeypairAdd() {
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);
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
          (value) => !keypairs.some((keypair) => keypair.label === value)
        ),
      publicKey: yup
        .string()
        .matches(
          /^(02|03)[a-fA-F0-9]{64}$/,
          "Public key must be a valid 66-character compressed hexadecimal starting with '02' or '03'"
        )
        .required("Public Key is required"),
      privateKey: yup
        .string()
        .matches(
          /^[a-fA-F0-9]{64}$/,
          "Private key must be a 64-character hexadecimal"
        )
        .required("Private Key is required"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      try {
        await dispatch(addKeypair(data)).unwrap();
      } catch (error) {
        console.error("Failed to add keypair:", error);
      }
    }
    handleClose();
  };

  function validateKeyPair(privateKey, publicKey) {
    try {
      const keyPair = ec.keyFromPrivate(privateKey);
      const derivedPublicKey = keyPair.getPublic().encode("hex", true);
      return derivedPublicKey === publicKey;
    } catch (error) {
      console.error("Failed to validate key pair:", error);
      return false;
    }
  }

  return (
    <>
      <BsNodePlus
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
          <Modal.Title>Add Keypair</Modal.Title>
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
              <Form.Control
                type="text"
                {...register("publicKey")}
                isInvalid={!!errors.publicKey}
              />
              <Form.Control.Feedback type="invalid">
                {errors.publicKey?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mb-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>

                <Form.Control.Feedback type="invalid">
                  {errors.privateKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>{" "}
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

export default KeypairAdd;
