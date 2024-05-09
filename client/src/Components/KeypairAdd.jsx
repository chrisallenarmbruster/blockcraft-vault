import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import elliptic from "elliptic";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addKeypair } from "../store/dataSlice";
import { useSelector } from "react-redux";

const EC = elliptic.ec;
const ec = new EC("secp256k1");

function KeypairAdd() {
  const keypairs = useSelector(
    (state) => state.data.unencryptedData?.keypairs || []
  );

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
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    console.log(data);
    // Perform key pair validation
    if (!validateKeyPair(data.privateKey, data.publicKey)) {
      setError("publicKey", {
        type: "manual",
        message: "Public key is not a cryptographic match for the private key",
      });
    } else {
      clearErrors("publicKey");
      dispatch(addKeypair(data));
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

      <Form.Group className="mb-3" controlId="formPrivateKey">
        <Form.Label>Private Key</Form.Label>
        <Form.Control
          type="password"
          {...register("privateKey")}
          isInvalid={!!errors.privateKey}
        />
        <Form.Control.Feedback type="invalid">
          {errors.privateKey?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Keypair
      </Button>
    </Form>
  );
}

export default KeypairAdd;
