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
import { useNavigate } from "react-router-dom";
import { useAddProduitMutation } from "features/produit/productSlice";
import {
  Category,
  useCreateCategoryMutation,
  useFetchCategoriesQuery,
} from "features/category/categorySlice";
import {
  SubCategory,
  useCreateSubCategoryMutation,
} from "features/subCategory/subCategorySlice";
import Swal from "sweetalert2";

const CreateProduct = () => {
  document.title = "Créer produit | Radhouani";

  const [category, setCategory] = useState<Category[]>([]);
  const [categoryid, setCategoryid] = useState("");
  const [sousCategory, setSousCategory] = useState<SubCategory[]>([]);
  const [sousCategoryid, setSousCategoryid] = useState("");
  useEffect(() => {
    const getCategory = async () => {
      const reqdata = await fetch("http://localhost:8000/category/all");
      const resdata = await reqdata.json();
      setCategory(resdata);
    };
    getCategory();
  }, []);
  const handlecategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (categoryId !== "") {
      const reqstatedata = await fetch(
        `http://localhost:8000/subCategory/onesubcategory?idcategory=${categoryId}`
      );
      const resstatedata = await reqstatedata.json();
      setSousCategory(resstatedata);
      setCategoryid(categoryId);
    } else {
      setSousCategory([]);
    }
  };
  const handlesousCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const getstateid = e.target.value;
    setSousCategoryid(getstateid);
  };
  const navigate = useNavigate();
  // Mutation to create product
  const [createProduct] = useAddProduitMutation();
  // Product's Values and Functions
  const [formData, setFormData] = useState({
    idproduit: 1,
    nomProduit: "",
    imageProduit: "",
    marque: "",
    remarqueProduit: "",
    sousCategoryID: 1,
    categoryID: 1,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmitProduct = (e: React.FormEvent<HTMLFormElement>) => {
    formData["categoryID"] = parseInt(categoryid);
    formData["sousCategoryID"] = parseInt(sousCategoryid);
    e.preventDefault();
    createProduct(formData).then(() => setFormData(formData));
    notify();
    navigate("/products-list");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le Produit a été créer avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };
  //Common Function
  function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        const base64Data = base64String.split(",")[1]; // Extract only the Base64 data

        resolve(base64Data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("imageProduit") as HTMLFormElement)
      .files[0];
    const base64 = await convertToBase64(file);
    console.log(base64);
    setFormData({
      ...formData,
      imageProduit: base64 as string,
    });
  };

  // Modal to create a new category
  const [modal_AddCategoryModals, setmodal_AddCategoryModals] =
    useState<boolean>(false);
  function tog_AddCategorysModals() {
    setmodal_AddCategoryModals(!modal_AddCategoryModals);
  }

  // Mutation to create a new Category
  const [createCategory] = useCreateCategoryMutation();

  // Category's Values and Functions
  const initialCategoryValue = {
    idcategory: 1,
    nom: "",
    image: "",
    id_parent: 0,
    final_level: 0,
  };

  const [categoryData, setCategoryData] = useState(initialCategoryValue);
  const { idcategory, nom, image, id_parent, final_level } = categoryData;
  const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createCategory(categoryData).then(() => setCategoryData(categoryData));
    notifyCategory();
  };

  const handleFileCategoryUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("image") as HTMLFormElement).files[0];
    const base64 = await convertToBase64(file);
    setCategoryData({ ...categoryData, image: base64 as string });
  };

  const notifyCategory = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le Catégorie a été créer avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  // Toast Notification For SubCategory
  const notifySubCategory = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le Sous-Catégorie a été créer avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  // Modal to create a new subcategory
  const [modal_AddSubCategoryModals, setmodal_AddSubCategoryModals] =
    useState<boolean>(false);
  function tog_AddSubCategorysModals() {
    setmodal_AddSubCategoryModals(!modal_AddSubCategoryModals);
  }

  // Fetch All Categories
  const { data: listeCategories = [] } = useFetchCategoriesQuery();

  //Mutation to create a new subcategory
  const [createNewSubCategory] = useCreateSubCategoryMutation();

  // SubCategory's Values and Functions
  const initialSubCategoryValue = {
    idSubCategory: 1,
    title: "",
    subDescription: "",
    parentID: 4,
  };

  const [subCategoryData, setSubCategoryData] = useState(
    initialSubCategoryValue
  );
  const { idSubCategory, title, subDescription, parentID } = subCategoryData;
  const onChangeSubCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubCategoryData((prevState) => ({
      ...prevState,
      parentID: parseInt(categoryid),
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmitSubCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createNewSubCategory(subCategoryData).then(() =>
      setSubCategoryData(subCategoryData)
    );
    notifySubCategory();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Créer Produit" pageTitle="Produits" />
          <form
            id="createproduct-form"
            autoComplete="off"
            className="needs-validation"
            noValidate
            onSubmit={onSubmitProduct}
          >
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <div className="mb-3">
                      <Form.Label htmlFor="nomProduit">
                        Titre du produit
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="nomProduit"
                        placeholder="..."
                        required
                        onChange={onChange}
                        value={formData.nomProduit}
                      />

                      <div className="invalid-feedback">
                        Veuillez saisir le titre du produit.
                      </div>
                    </div>
                    <Row>
                      <Col lg={6} style={{ marginBottom: 15 }}>
                        <div className="mb-3">
                          <Form.Label htmlFor="marque">Marque</Form.Label>
                          <Form.Control
                            type="text"
                            id="marque"
                            placeholder="..."
                            value={formData.marque}
                            onChange={onChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        <div className="mb-3">
                          <Form.Label htmlFor="remarqueProduit">
                            Description
                          </Form.Label>
                          <Form.Control
                            type="text"
                            id="remarqueProduit"
                            placeholder="..."
                            value={formData.remarqueProduit}
                            onChange={onChange}
                            as="textarea"
                            rows={3}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={6}>
                        {/* ******* Select Category ******* */}
                        <div>
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <Form.Label>Catégorie</Form.Label>
                            </div>
                          </div>
                          <div className="input-group mb-3">
                            <select
                              className="form-select"
                              id="choices-category-input"
                              name="choices-category-input"
                              onChange={handlecategory}
                            >
                              <option value="">Choisir ...</option>
                              {category.map((category) => (
                                <option
                                  key={category.idcategory}
                                  value={category.idcategory}
                                >
                                  {category.nom}
                                </option>
                              ))}
                            </select>
                            <div className="flex-shrink-0">
                              <Button
                                className="float-end"
                                variant="success"
                                id="add-btn"
                                onClick={() => tog_AddCategorysModals()}
                                style={{ marginLeft: 7 }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="error-msg mt-1">
                            svp selectionner la categorie.
                          </div>
                        </div>
                      </Col>
                      <Col>
                        {/* ******* Select SubCategory ******* */}
                        <div>
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <Form.Label>Sous-Catégorie</Form.Label>
                            </div>
                          </div>
                          <div className="input-group mb-3">
                            <select
                              className="form-select"
                              id="choices-sous-category-input"
                              name="choices-sous-category-input"
                              onChange={handlesousCategory}
                            >
                              <option value="">Choisir ...</option>
                              {sousCategory.map((souscategory) => (
                                <option
                                  key={souscategory.idSubCategory}
                                  value={souscategory.idSubCategory}
                                >
                                  {souscategory.title}
                                </option>
                              ))}
                            </select>
                            <div className="flex-shrink-0">
                              <Button
                                className="float-end"
                                variant="success"
                                id="add-btn"
                                onClick={() => tog_AddSubCategorysModals()}
                                style={{ marginLeft: 7 }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <div className="error-msg mt-1">
                            svp selectionner la categorie.
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card style={{ height: "24.5rem", marginBottom: 0 }}>
                  <Card.Body
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center mb-3">
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <label
                            htmlFor="imageProduit"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Select Fournisseur Logo"
                          >
                            <span className="avatar-xs d-inline-block">
                              <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                <i className="ri-image-fill"></i>
                              </span>
                            </span>
                          </label>
                          <input
                            className="d-none"
                            type="file"
                            name="imageProduit"
                            id="imageProduit"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                          />
                        </div>
                        <div className="avatar-xl">
                          <div className="avatar-title bg-light rounded-4">
                            <img
                              src={`data:image/jpeg;base64, ${formData.imageProduit}`}
                              alt={formData.nomProduit}
                              id="category-img"
                              className="avatar-xl h-auto rounded-4 object-fit-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="error-msg mt-1">
                      Please add a product images.
                    </div>
                  </Card.Body>
                </Card>
                <Row>
                  <div className="text-end mb-3" style={{ marginTop: 13 }}>
                    <Button variant="primary" type="submit" className="w-sm">
                      Ajouter
                    </Button>
                  </div>
                </Row>
              </Col>
            </Row>
          </form>
          {/* ******Modal For Category****** */}
          {/* <Modal
            id="showModal"
            className="fade zoomIn"
            size="sm"
            show={modal_AddCategoryModals}
            onHide={() => {
              tog_AddCategorysModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Ajouter Nouveau Catégorie
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form className="tablelist-form" onSubmit={onSubmitCategory}>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="nom">
                        Nom Catégorie <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={categoryData.nom}
                        onChange={onChangeCategory}
                        id="nom"
                        placeholder="Taper le nom du catégorie"
                        required
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label d-block">
                        Image <span className="text-danger">*</span>
                      </label>
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <label
                            htmlFor="image"
                            className="mb-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            title="Select Category's Image"
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
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={(e) => handleFileCategoryUpload(e)}
                          />
                        </div>
                        <div className="avatar-xl">
                          <div className="avatar-title bg-light rounded-3">
                            <img
                              src={`data:image/jpeg;base64, ${categoryData.image}`}
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
                          tog_AddCategorysModals();
                        }}
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Fermer
                      </Button>
                      <Button
                        type={"submit"}
                        onClick={() => {
                          tog_AddCategorysModals();
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
          </Modal> */}

          {/* ******Modal For Sub Category****** */}
          {/* <Modal
            id="showModal"
            className="fade zoomIn"
            size="lg"
            show={modal_AddSubCategoryModals}
            onHide={() => {
              tog_AddSubCategorysModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Ajouter Nouveau Sous-Catégorie
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form className="tablelist-form" onSubmit={onSubmitSubCategory}>
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="title">
                        Titre Sous-Catégorie
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={subCategoryData.title}
                        onChange={onChangeSubCategory}
                        id="title"
                        placeholder="Taper le title du sous-catégorie"
                        required
                      />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="categorySelect">
                        Catégorie
                      </Form.Label>
                      <select
                        className="form-select"
                        name="choices-single-default"
                        id="categorySelect"
                        onChange={handlecategory}
                      >
                        <option value="">Choisir Catégorie</option>
                        {listeCategories.map((category) => (
                          <option
                            key={category.idcategory}
                            value={category.idcategory}
                          >
                            {category.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="subDescription">
                        Description
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={subCategoryData.subDescription}
                        onChange={onChangeSubCategory}
                        id="subDescription"
                        placeholder="Taper Description"
                        required
                      />
                    </div>
                  </Col>
                  <Col lg={12} className="modal-footer">
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddSubCategorysModals();
                        }}
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Fermer
                      </Button>
                      <Button
                        type={"submit"}
                        onClick={() => {
                          tog_AddSubCategorysModals();
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
          </Modal> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CreateProduct;