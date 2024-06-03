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
import { BsNodePlus, BsEye, BsEyeSlash } from "react-icons/bs";
import QRCodeScanner from "./QRCodeScanner";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function generateKeyPair() {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate("hex");
  const publicKeyCompressed = keyPair.getPublic().encode("hex", true);
  return { privateKey, publicKeyCompressed };
}

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
    setValue,
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
        handleClose();
      } catch (error) {
        console.error("Failed to add keypair:", error);
      }
    }
  };

  const handleScanSuccess = (data) => {
    console.log("Callback received scanned data:", data.text);
    setValue("publicKey", data.text);
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
                title="Type a friendly name for this keypair."
                placeholder="Type a friendly name for this keypair"
              />
              <Form.Control.Feedback type="invalid">
                {errors.label?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPublicKey">
              <Form.Label className="d-flex justify-content-between">
                <div className="py-0">Public Key</div>
                <Button
                  title="If you don't have a keypair, you can generate one by clicking here."
                  variant="link"
                  className="py-0 text-orange"
                  onClick={() => {
                    const { privateKey, publicKeyCompressed } =
                      generateKeyPair();
                    setValue("publicKey", publicKeyCompressed);
                    setValue("privateKey", privateKey);
                  }}
                >
                  Generate New Keypair
                </Button>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  {...register("publicKey")}
                  isInvalid={!!errors.publicKey}
                  placeholder="Type, paste, scan or generate"
                  title="Type a public key, scan a QR code or generate a new keypair."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  title="Click to scan QR code."
                >
                  <QRCodeScanner onScanSuccess={handleScanSuccess} />
                </Button>
                <Form.Control.Feedback type="invalid">
                  {errors.publicKey?.message}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="updateFormPrivateKey">
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mbxs-5">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  {...register("privateKey")}
                  isInvalid={!!errors.privateKey}
                  placeholder="Type, paste or generate"
                  title="Type or paste private key here.."
                />
                <Button
                  variant="outline-secondary rounded-right"
                  onClick={() => setShowPassword(!showPassword)}
                  title="Click to toggle private key visibility."
                >
                  {showPassword ? (
                    <BsEyeSlash className="text-light" />
                  ) : (
                    <BsEye className="text-light" />
                  )}
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
