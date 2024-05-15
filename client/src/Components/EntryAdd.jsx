import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addEntry } from "../store/entriesSlice";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  from: yup.string().matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
  privateKey: yup.string().required("Private key is required"),
  amount: yup
    .number()
    .positive("Amount must be a positive number")
    .integer("Amount must be an integer"),
  to: yup.string().matches(/^(02|03)[a-fA-F0-9]{64}$/, "Invalid public key"),
});

function EntryAdd() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    clearErrors("from");
    try {
      await dispatch(addEntry(data)).unwrap();
      navigate("/assets");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to add entry", error.message);
      } else {
        console.error("An unknown error occurred while adding the entry");
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formFrom">
        <Form.Label>From</Form.Label>
        <Form.Control
          type="text"
          {...register("from")}
          isInvalid={!!errors.from}
        />
        <Form.Control.Feedback type="invalid">
          {errors.from?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formPrivateKey">
        <Form.Label>Private Key</Form.Label>
        <Form.Control
          type="text"
          {...register("privateKey")}
          isInvalid={!!errors.privateKey}
        />
        <Form.Control.Feedback type="invalid">
          {errors.privateKey?.message}
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

      <Form.Group className="mb-3" controlId="formTo">
        <Form.Label>To</Form.Label>
        <Form.Control type="text" {...register("to")} isInvalid={!!errors.to} />
        <Form.Control.Feedback type="invalid">
          {errors.to?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">Add Entry</Button>
    </Form>
  );
}

export default EntryAdd;
