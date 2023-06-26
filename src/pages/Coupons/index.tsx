import React, { useState, useMemo } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Link } from "react-router-dom";

import offerbanner from "../../assets/images/ecommerce/offer-banner.jpg";

import {
  useFetchClientPhysiquesQuery,
  useDeleteClientPhysiqueMutation,
  useAddClientPhysiqueMutation,
  ClientPhysique,
} from "features/clientPhysique/clientPhysiqueSlice";
import Swal from "sweetalert2";

const Coupons = () => {
  const { data = [] } = useFetchClientPhysiquesQuery();
  const [deleteClientPhysique] = useDeleteClientPhysiqueMutation();
  const [createClientPhysique] = useAddClientPhysiqueMutation();

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le Client Physique a été créer avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const AlertDelete = async (id: number) => {
    swalWithBootstrapButtons
      .fire({
        title: "Êtes-vous sûr?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le !",
        cancelButtonText: "Non, annulez !",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteClientPhysique(id);
          swalWithBootstrapButtons.fire(
            "Supprimé !",
            "Le Client Physique a été supprimé.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Annulé",
            "Le Client Physique est en sécurité :)",
            "error"
          );
        }
      });
  };

  const etatActive = data.filter((fournisseur) => fournisseur.etat === 1);
  const etatNonActive = data.filter((fournisseur) => fournisseur.etat === 0);

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
    notify();
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

  document.title = "Client Physique | Radhouani";

  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        disableFilters: true,
        filterable: true,
        accessor: "idclient_p",
      },
      {
        Header: "Avatar",
        disableFilters: true,
        filterable: true,
        accessor: (clienphy: ClientPhysique) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  src={`data:image/jpeg;base64, ${clienphy.avatar}`}
                  alt=""
                  className="avatar-xs rounded-circle user-profile-img"
                />
              </div>
            </div>
          );
        },
      },
      {
        Header: "Nom Client",
        accessor: "raison_sociale",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "C.I.N ",
        accessor: "cin",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Adresse",
        accessor: "adresse",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Telephone",
        accessor: "tel",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "E-mail",
        accessor: "mail",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "RIB",
        accessor: "rib",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Etat",
        disableFilters: true,
        filterable: true,
        accessor: (clientPhy: ClientPhysique) => {
          switch (clientPhy.etat) {
            case 0:
              return (
                <span className="badge badge-soft-success text-uppercase">
                  {" "}
                  inactif
                </span>
              );
            case 1:
              return (
                <span className="badge badge-soft-danger text-uppercase">
                  {" "}
                  actif
                </span>
              );
            default:
              return (
                <span className="badge badge-soft-success text-uppercase">
                  {" "}
                  inactif
                </span>
              );
          }
        },
      },
      {
        Header: "Remarque",
        accessor: "remarque",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Credit",
        accessor: "credit",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (clientPhy: ClientPhysique) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  className="badge badge-soft-primary edit-item-btn"
                  data-bs-toggle="modal"
                >
                  Modifier
                </Link>
              </li>
              <li>
                <Link
                  to="/coupons"
                  onClick={() => AlertDelete(clientPhy.idclient_p)}
                  data-bs-toggle="modal"
                  className="badge badge-soft-danger remove-item-btn"
                >
                  Supprimer
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [showCoupons]
  );

  const [modal_AddCouponsModals, setmodal_AddCouponsModals] =
    useState<boolean>(false);
  function tog_AddCouponsModals() {
    setmodal_AddCouponsModals(!modal_AddCouponsModals);
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Client Physique" pageTitle="Tableau de bord" />
          <div id="couponsList">
            <Row>
              <Col xxl={12}>
                <Card>
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xxl={3} md={5}>
                        {/* <div className="search-box mb-3 mb-md-0">
                          <input
                            type="text"
                            className="form-control search"
                            id="searchProductList"
                            placeholder="Rechercher client par nom, date..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div> */}
                      </Col>
                      <Col className="col-md-auto ms-auto">
                        <Button
                          variant="success"
                          onClick={() => tog_AddCouponsModals()}
                          className="add-btn"
                        >
                          <i className="bi bi-plus-circle me-1 align-middle"></i>
                          Ajouter Client Physique
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Body>
                    <div className="table-responsive table-card">
                      <TableContainer
                        columns={columns || []}
                        data={data || []}
                        isGlobalFilter={true}
                        iscustomPageSize={false}
                        isBordered={false}
                        customPageSize={10}
                        className="custom-header-css table align-middle table-nowrap"
                        tableClassName="table-centered align-middle table-nowrap mb-0"
                        theadClassName="text-muted table-light"
                        SearchPlaceholder="Rechercher Client Physique..."
                      />
                      <div className="noresult" style={{ display: "none" }}>
                        <div className="text-center">
                          {/* <lord-icon src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop" colors="primary:#121331,secondary:#08a88a" style="width:75px;height:75px"></lord-icon> */}
                          <h5 className="mt-2">Sorry! No Result Found</h5>
                          <p className="text-muted mb-0">
                            We've searched more than 150+ Orders We did not find
                            any orders for you search.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          <Modal
            id="showModal"
            className="fade zoomIn"
            size="lg"
            show={modal_AddCouponsModals}
            onHide={() => {
              tog_AddCouponsModals();
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
                        <div className="avatar-lg">
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
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="raison_sociale">
                        Nom Client
                      </Form.Label>
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
                        id="statusSelect"
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
                  <Col lg={12}>
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
                        <div className="avatar-lg">
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
                          tog_AddCouponsModals();
                        }}
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Fermer
                      </Button>
                      <Button
                        type={"submit"}
                        onClick={() => {
                          tog_AddCouponsModals();
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
        </Container>
      </div>

      <Offcanvas
        show={showCoupons}
        onHide={() => setShowCoupons(!showCoupons)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cyber Sale</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div>
            <img src={offerbanner} alt="" className="img-thumbnail" />
          </div>
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Use Code</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.code}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Discount</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.discount}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Start Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.startDate}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">END Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.endDate}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Product Type</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.productType}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Status</span>
                    </td>
                    <td>
                      <span
                        className={
                          showCouponDetails.status === "Expired"
                            ? "badge badge-soft-danger text-uppercase"
                            : "badge badge-soft-success text-uppercase"
                        }
                      >
                        {showCouponDetails.status}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};

export default Coupons;