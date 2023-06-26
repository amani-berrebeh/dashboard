import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Modal,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import PaiementTotal from "./PaiementTotal";
import PaiementEspece from "./PaiementEspece";
import PaiementCheque from "./PaiementCheque";
// Import Images
import logoDark from "assets/images/logo-dark.png";
import logoLight from "assets/images/logo-light.png";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  ClientPhysique,
  useAddClientPhysiqueMutation,
  useFetchClientPhysiquesQuery,
} from "features/clientPhysique/clientPhysiqueSlice";
import { Produit, useFetchProduitsQuery } from "features/produit/productSlice";
import { useAddFactureMutation } from "features/facture/factureSlice";
import NewComponent from "./NewComponent";

const PassagerInvoice = () => {
  document.title = "Créer Facture | Radhouani";
  const [selectedd, setSelectedd] = useState("Paiement total en espèces");

  const handleChangeselect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedd(e.target.value);
  };

  const [clientPhysique, setClientPhysique] = useState<ClientPhysique[]>([]);
  const [selected, setSelected] = useState<ClientPhysique[]>([]);
  const [clientPhyId, setClientPhyId] = useState("");

  useEffect(() => {
    const getClientPhysique = async () => {
      const reqdata = await fetch("http://localhost:8000/clientPyh/clients");
      const resdata = await reqdata.json();
      setClientPhysique(resdata);
    };
    getClientPhysique();
  }, []);

  const handleClientPhy = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientPhysiqueId = e.target.value;
    if (clientPhysiqueId !== "") {
      const reqstatedata = await fetch(
        `http://localhost:8000/clientPyh/one/${clientPhysiqueId}`
      );
      const resstatedata = await reqstatedata.json();
      setSelected(await resstatedata);
      console.log(reqstatedata);
      setClientPhyId(clientPhysiqueId);
    } else {
      setSelected([]);
    }
    console.log(clientPhysiqueId);
  };

  //Query to Fetch All Client Physique
  const { data: allProduit = [] } = useFetchProduitsQuery();
  // const mTotalHT = allProduit.reduce(
  //   (sum, i) => (sum += i.MontantTotalProduit),
  //   0
  // );
  // const mTotal = mTotalHT * 1.19;
  // Mutation to create a new Client
  const [createClientPhysique] = useAddClientPhysiqueMutation();

  //Toast Notification For Client Physique
  const notifyClientphysique = () => {
    toast.success("Le client physique a été créé avec succès", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const [formData, setFormData] = useState({
    idclient_p: 99,
    raison_sociale: "",
    adresse: "",
    tel: 14785236,
    mail: "",
    cin: 1234,
    avatar: "",
    rib: 1142250,
    etat: 1,
    remarque: "",
    credit: 123,
    piecejointes: "",
  });

  const {
    raison_sociale,
    adresse,
    tel,
    mail,
    cin,
    avatar,
    rib,
    etat,
    remarque,
    credit,
    piecejointes,
  } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createClientPhysique(formData).then(() => setFormData(formData));
    notifyClientphysique();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileLogo = (
      document.getElementById("avatar") as HTMLInputElement
    ).files?.item(0) as File;
    const filePJ = (
      document.getElementById("piecejointes") as HTMLInputElement
    ).files?.item(0) as File;

    const base64 = await convertToBase64(fileLogo);
    const base64PJ = await convertToBase64(filePJ);
    console.log(base64);

    setFormData({
      ...formData,
      avatar: base64 as string,
      piecejointes: base64PJ as string,
    });
  };

  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const base64Data = base64String.split(",")[1];

        resolve(base64Data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  // Modal to create a new client physique
  const [modal_AddClientPhyModals, setmodal_AddClientPhyModals] =
    useState<boolean>(false);
  function tog_AddClientPhyModals() {
    setmodal_AddClientPhyModals(!modal_AddClientPhyModals);
  }

  const [addFacture] = useAddFactureMutation();

  const factureValue = {
    idFacture: 1,
    designationFacture: "",
    dateFacturation: "",
    montantHt: 1,
    montantTtc: 1,
    quantiteProduit: 1,
    datePaiement: "",
    modePaiement: "",
    statusFacture: 1,
    clientID: 1,
    produitID: 1,
  };

  const [factureData, setFactureData] = useState(factureValue);
  const {
    idFacture,
    designationFacture,
    dateFacturation,
    montantHt,
    montantTtc,
    quantiteProduit,
    datePaiement,
    modePaiement,
    statusFacture,
    clientID,
    produitID,
  } = factureData;

  const onChangeFacture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFactureData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitFacture = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addFacture(factureData).then(() => setFactureData(factureValue));
    // notify();
  };

  function precise(x: number) {
    return x.toPrecision(4);
  }

  return (
    <Container fluid={true}>
      <Breadcrumb title="Créer Facture Passager" pageTitle="Factures" />
      <Row className="justify-content-center">
        <Col xxl={9}>
          <Card>
            <Form className="needs-validation" id="invoice_form">
              <Card.Body className="border-bottom border-bottom-dashed p-4">
                <Row>
                  <Col lg={4}>
                    <div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          id="choices-category-input"
                          name="choices-category-input"
                          onChange={handleClientPhy}
                        >
                          <option value="">Selectionner Client</option>
                          {clientPhysique.map((clientph) => (
                            <option
                              key={clientph.idclient_p}
                              value={clientph.idclient_p}
                            >
                              {clientph.raison_sociale}
                            </option>
                          ))}
                        </select>
                        {selected.map((s) => {
                          return (
                            <div className="mb-2">
                              {s.idclient_p === 18 ? (
                                <>
                                  <strong>Nom : </strong>
                                  <span>{s.raison_sociale}</span>

                                  <div>
                                    <strong>Adresse : </strong>
                                    <span>{s.adresse}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <strong>Nom : </strong>
                                  <span>{s.raison_sociale}</span>
                                  <div>
                                    <strong>C.I.N: </strong>
                                    <span>{s.cin}</span>
                                  </div>
                                  <div>
                                    <strong>Numéro Télephone: </strong>
                                    <span>{s.tel}</span>
                                  </div>
                                  <div>
                                    <strong>Adresse: </strong>
                                    <span>{s.adresse}</span>
                                  </div>
                                  <div>
                                    <strong>Email: </strong>
                                    <span>{s.mail}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <h4>Facture Pro Format</h4>
                  </Col>
                  <Col lg={4}>
                    <div className="profile-user mx-auto mb-3">
                      <input
                        id="profile-img-file-input"
                        type="file"
                        className="profile-img-file-input"
                      />
                      <label
                        htmlFor="profile-img-file-input"
                        className="d-block"
                      >
                        <span
                          className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                          style={{ height: "60px", width: "256px" }}
                        >
                          <img
                            src={logoDark}
                            className="card-logo card-logo-dark user-profile-image img-fluid"
                            alt="logo dark"
                          />
                          <img
                            src={logoLight}
                            className="card-logo card-logo-light user-profile-image img-fluid"
                            alt="logo light"
                          />
                        </span>
                      </label>
                    </div>
                    <div className="mb-2">
                      <span>
                        <strong>Matricule Fiscale:</strong>{" "}
                        <span>147852369</span>
                      </span>
                      <div className="mb-2">
                        <span>
                          <strong>Adresse:</strong>{" "}
                          <span>Cite Ennour, Gafsa</span>
                          <br />
                          <span> </span>
                          <span>2123, Gafsa</span>
                        </span>
                      </div>
                      <div className="mb-2 mb-lg-0">
                        <span>
                          <strong>Tél:</strong> <span>76001002</span>
                        </span>
                      </div>
                      <div className="mb-2">
                        <span>
                          <strong>Email:</strong>{" "}
                          <span>radhouani@gmail.com</span>
                        </span>
                      </div>
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Button onClick={() => tog_AddClientPhyModals()}>
                      Ajouter Nouveau Client
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="p-4">
                <Row className="g-3">
                  <Col lg={3} sm={6}>
                    <Form.Label htmlFor="invoicenoInput">
                      Numero Facture
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="invoicenoInput"
                      placeholder="Numero Facture"
                      defaultValue="#VL25000355"
                    />
                  </Col>
                  <Col lg={3} sm={6}>
                    <div>
                      <Form.Label htmlFor="date-field">Date</Form.Label>
                      <Flatpickr
                        className="form-control flatpickr-input"
                        id="date-field"
                        placeholder="Selectionner Date"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="p-4">
                <NewComponent />
                <Row className="border-top border-top-dashed mt-2">
                  <Col lg={8}></Col>
                  <Col>
                    <div className="p-0">
                      <Col className="table-borderless table-sm table-nowrap align-middle mb-0">
                        <tbody>
                          <tr>
                            <th scope="row">Total</th>
                            <td style={{ width: "150px" }}>
                              <Form.Control
                                type="number"
                                // value={mTotalHT}
                                id="cart-subtotal"
                                placeholder="0.00"
                              />
                            </td>
                          </tr>
                          <tr>
                            <th scope="row">Taxe (19%)</th>
                            <td>
                              <Form.Control
                                type="number"
                                // value={precise(mTotal - mTotalHT)}
                                id="cart-tax"
                                placeholder="$0.00"
                              />
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed">
                            <th scope="row">Montant Total</th>
                            <td>
                              <Form.Control
                                // value={precise(mTotal)}
                                type="number"
                                id="cart-total"
                                placeholder="0.00"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Col>
                    </div>
                  </Col>
                </Row>
                {clientPhyId === "18" ? (
                  <Row className="mt-3">
                    <Col lg={9}>
                      <div className="mb-2">
                        <Form.Label
                          htmlFor="choices-payment-type"
                          className="text-muted text-uppercase fw-semibold"
                        >
                          Reglement
                        </Form.Label>
                        <select
                          className="form-select"
                          data-choices
                          data-choices-search-false
                          id="choices-payment-type"
                          value={selectedd}
                          onChange={(e) => handleChangeselect(e)}
                        >
                          <option value="Paiement total en espèces">
                            Paiement total en espèces
                          </option>
                        </select>
                        {selectedd === "Paiement total en espèces" ? (
                          <PaiementTotal />
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <Form.Label htmlFor="choices-payment-status">
                        Status de Payement
                      </Form.Label>
                      <select
                        className="form-select"
                        data-choices
                        data-choices-search-false
                        id="choices-payment-status"
                      >
                        <option value="">Selectionner Status</option>
                        <option value="Paid">Payé</option>
                        <option value="Paid">impayé</option>
                        <option value="Paid">Semi Payé</option>
                      </select>
                    </Col>
                  </Row>
                ) : (
                  <Row className="mt-3">
                    <Col lg={9}>
                      <div className="mb-2">
                        <Form.Label
                          htmlFor="choices-payment-type"
                          className="text-muted text-uppercase fw-semibold"
                        >
                          Reglement
                        </Form.Label>
                        <select
                          className="form-select"
                          data-choices
                          data-choices-search-false
                          id="choices-payment-type"
                          value={selectedd}
                          onChange={(e) => handleChangeselect(e)}
                        >
                          <option value="Paiement total en espèces">
                            Paiement total en espèces
                          </option>
                          <option value="Paiement partiel espèces">
                            Paiement partiel espèces
                          </option>
                          <option value="Paiement partiel chèque">
                            Paiement partiel chèque
                          </option>
                        </select>
                        {selectedd === "Paiement total en espèces" ? (
                          <PaiementTotal />
                        ) : (
                          ""
                        )}

                        {selectedd === "Paiement partiel espèces" ? (
                          <PaiementEspece />
                        ) : (
                          ""
                        )}
                        {selectedd === "Paiement partiel chèque" ? (
                          <PaiementCheque />
                        ) : (
                          ""
                        )}
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <Form.Label htmlFor="choices-payment-status">
                        Status de Payement
                      </Form.Label>
                      <select
                        className="form-select"
                        data-choices
                        data-choices-search-false
                        id="choices-payment-status"
                      >
                        <option value="">Selectionner Status</option>
                        <option value="Paid">Payé</option>
                        <option value="Paid">impayé</option>
                        <option value="Paid">Semi Payé</option>
                      </select>
                    </Col>
                  </Row>
                )}

                <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                  <Button variant="success" type="submit">
                    <i className="ri-printer-line align-bottom me-1"></i>{" "}
                    Enregister
                  </Button>
                  <Link to="#" className="btn btn-primary">
                    <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                    Telecharger Facture
                  </Link>
                </div>
              </Card.Body>
            </Form>
          </Card>
        </Col>
      </Row>
      {/* ******Modal For Client Physique****** */}
      <Modal
        id="showModal"
        className="fade zoomIn"
        size="lg"
        show={modal_AddClientPhyModals}
        onHide={() => {
          tog_AddClientPhyModals();
        }}
        centered
      >
        <Modal.Header className="px-4 pt-4" closeButton>
          <h5 className="modal-title fs-18" id="exampleModalLabel">
            Ajouter Client Physique
          </h5>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form className="tablelist-form" onSubmit={onSubmit}>
            <Row>
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <input type="hidden" id="id-field" />
              <Col lg={12}>
                <div className="mb-3">
                  <div className="position-relative d-inline-block">
                    <div className="position-absolute top-100 start-100 translate-middle">
                      <label
                        htmlFor="avatar"
                        className="mb-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Select Client Physique Avatar"
                      >
                        <span className="avatar-xs d-inline-block">
                          <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                            <i className="ri-image-fill"></i>
                          </span>
                        </span>
                      </label>
                      <input
                        className="form-control d-none"
                        type="file"
                        name="avatar"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </div>
                    <div className="avatar-xl">
                      <div className="avatar-title bg-light rounded-3">
                        <img
                          src={`data:image/jpeg;base64, ${formData.avatar}`}
                          alt=""
                          id="category-img"
                          className="avatar-md h-auto rounded-3 object-fit-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="error-msg mt-1">
                    Please add a category images.
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="raison_sociale">Nom Client</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.raison_sociale}
                    onChange={onChange}
                    id="raison_sociale"
                    placeholder="Taper Raison sociale"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="cin">C.I.N</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cin}
                    onChange={onChange}
                    id="cin"
                    placeholder="Taper C.I.N"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="tel">Telephone</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tel}
                    onChange={onChange}
                    id="tel"
                    placeholder="Taper numéro"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="adresse">Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.adresse}
                    onChange={onChange}
                    id="adresse"
                    placeholder="Taper l'adresse du fournisseur"
                    required
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="rib">RIB</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.rib}
                    onChange={onChange}
                    id="rib"
                    placeholder="Taper RIB "
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="mail">E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.mail}
                    onChange={onChange}
                    id="mail"
                    placeholder="Taper e-mail"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="statusSelect">Statut</Form.Label>
                  <select
                    className="form-select"
                    name="choices-single-default"
                    id="status-Field"
                  >
                    <option value="">Status</option>
                    <option value="Active">Actif</option>
                    <option value="Expired">Inactif</option>
                  </select>
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="remarque">Remarque</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.remarque}
                    onChange={onChange}
                    id="remarque"
                    placeholder="Taper vos remarques"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="credit">Credit</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.credit}
                    onChange={onChange}
                    id="credit"
                    placeholder="Taper crédit"
                    required
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className="mb-3">
                  <label htmlFor="avatar" className="form-label d-block">
                    Piece-Jointe <span className="text-danger">*</span>
                  </label>

                  <div className="position-relative d-inline-block">
                    <div className="position-absolute top-100 start-100 translate-middle">
                      <label
                        htmlFor="piecejointes"
                        className="mb-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Select Client Physique Avatar"
                      >
                        <span className="avatar-xs d-inline-block">
                          <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                            <i className="ri-image-fill"></i>
                          </span>
                        </span>
                      </label>
                      <input
                        className="form-control d-none"
                        type="file"
                        name="piecejointes"
                        id="piecejointes"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e)}
                      />
                    </div>
                    <div className="avatar-xl">
                      <div className="avatar-title bg-light rounded-3">
                        <img
                          src={`data:image/jpeg;base64, ${formData.piecejointes}`}
                          alt=""
                          id="category-img"
                          className="avatar-md h-auto rounded-3 object-fit-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="error-msg mt-1">
                    Please add a category images.
                  </div>
                </div>
              </Col>
              <Col lg={12} className="modal-footer">
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => {
                      tog_AddClientPhyModals();
                    }}
                  >
                    <i className="ri-close-line align-bottom me-1"></i> Fermer
                  </Button>
                  <Button
                    type={"submit"}
                    onClick={() => {
                      tog_AddClientPhyModals();
                    }}
                    variant="primary"
                    id="add-btn"
                  >
                    Ajouter
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default PassagerInvoice;