import { useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import KeypairDelete from "./KeypairDelete";
import { useNavigate } from "react-router-dom";

function Keypairs() {
  const keypairs =
    useSelector((state) => state.data.unencryptedData?.keypairs) || [];
  const navigate = useNavigate();

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <>
      {" "}
      <Button variant="primary" onClick={() => navigate("/add-keypair")}>
        Add
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Label</th>
            <th>Public Key</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keypairs.map((keypair) => (
            <tr key={keypair.nanoId}>
              <td>{keypair.label}</td>
              <td>{formatKey(keypair.publicKey)}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/update-keypair", { state: { keypair } })
                  }
                >
                  Update
                </Button>
                <KeypairDelete keypair={keypair} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Keypairs;
