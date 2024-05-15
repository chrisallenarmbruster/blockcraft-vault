import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { InputGroup, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateKeypair } from "../store/dataSlice";
import PropTypes from "prop-types";
import { createSelector } from "reselect";
import { useLocation, useNavigate } from "react-router-dom";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

const selectKeypairs = createSelector(
  (state) => state.data.unencryptedData,
  (unencryptedData) => unencryptedData?.keypairs || []
);

function KeypairUpdate() {
  const location = useLocation();
  const navigate = useNavigate();
  const keypair = location.state?.keypair;
  const keypairs = useSelector(selectKeypairs);
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup
    .object({
      label: yup
        .string()
        .required("Label is required")
        .test(
          "unique-label",
          "Label already in use",
          (value) =>
            !keypairs.some(
              (kp) => kp.label === value && kp.nanoId !== keypair.nanoId
            )
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
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: keypair,
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
        await dispatch(updateKeypair({ ...keypair, ...data })).unwrap();
        navigate("/keypairs");
      } catch (error) {
        console.error("Failed to update keypair:", error);
      }
    }
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
    <Form onSubmit={handleSubmit(onSubmit)}>
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

      <Form.Group className="mb-3" controlId="updateFormPrivateKey">
        <Form.Label>Private Key</Form.Label>
        <InputGroup>
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

      <Button variant="primary" type="submit">
        Update Keypair
      </Button>
    </Form>
  );
}

KeypairUpdate.propTypes = {
  keypair: PropTypes.shape({
    nanoId: PropTypes.string.isRequired,
  }),
};

export default KeypairUpdate;
