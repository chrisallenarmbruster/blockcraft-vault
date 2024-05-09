import { useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import AddressDelete from "./AddressDelete";
import { useNavigate } from "react-router-dom";

function Addresses() {
  const addresses =
    useSelector((state) => state.data.unencryptedData?.addresses) || [];
  const navigate = useNavigate();

  const formatKey = (key) => {
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  return (
    <>
      <br />
      <span className="h2 me-3 mb-3">Addresses Book</span>
      <Button variant="primary" onClick={() => navigate("/add-address")}>
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
          {addresses.map((address) => (
            <tr key={address.nanoId}>
              <td>{address.label}</td>
              <td>{formatKey(address.publicKey)}</td>
              <td>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/update-address", { state: { address } })
                  }
                >
                  Update
                </Button>
                <AddressDelete address={address} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default Addresses;
