import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import SubCategoriesTable from "./subCategoriesTable";
import {
  Category,
  useFetchCategoriesQuery,
} from "features/category/categorySlice";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {
  useCreateSubCategoryMutation,
  useFetchSubCategoriesQuery,
} from "features/subCategory/subCategorySlice";
import Swal from "sweetalert2";

const SubCategories = () => {
  const { data = [] } = useFetchCategoriesQuery();
  const { data: subCategory = [] } = useFetchSubCategoriesQuery();
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Le sous-catégorie a été créer avec succès",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [createSubCategory] = useCreateSubCategoryMutation();

  const initialValue = {
    idSubCategory: 1,
    title: "",
    subDescription: "",
    parentID: 6,
    nom: "",
    idcategory: 6,
  };

  const [formData, setFormData] = useState(initialValue);
  const { nom, idSubCategory, title, subDescription, parentID, idcategory } =
    formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      parentID: parseInt(categoryStateID),
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSubCategory(formData).then(() => setFormData(initialValue));
    notify();
  };

  const [categoryState, setCategoryState] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category[]>([]);
  const [categoryStateID, setCategoryStateID] = useState("");

  useEffect(() => {
    const getCategory = async () => {
      const reqdata = await fetch("http://localhost:8000/category/all");
      const resdata = await reqdata.json();
      console.log(resdata);
      setCategoryState(resdata);
    };
    getCategory();
  }, []);

  const handleCategory = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    if (categoryId !== "") {
      const reqstatedata = await fetch(
        `http://localhost:8000/category/one/${categoryId}`
      );
      const resstatedata = await reqstatedata.json();
      setSelected(await resstatedata);
      console.log(reqstatedata);
      setCategoryStateID(categoryId);
    } else {
      setSelected([]);
    }
    console.log(categoryId);
  };

  document.title = "Sous-Catégorie | Radhouani";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Sous-Catégorie" pageTitle="Produits" />
          <Row>
            <Col xxl={3}>
              <Card>
                <Card.Header>
                  <h6 className="card-title mb-0" id="addCategoryLabel">
                    Créer Catégorie
                  </h6>
                </Card.Header>
                <Card.Body>
                  <form
                    autoComplete="off"
                    className="needs-validation createCategory-form"
                    id="createCategory-form"
                    noValidate
                    onSubmit={onSubmit}
                  >
                    <input
                      type="hidden"
                      id="categoryid-input"
                      className="form-control"
                      value=""
                    />
                    <Row>
                      <Col xxl={12} lg={6}>
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Titre Sous-catégorie
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Entrer Titre"
                            required
                            value={formData.title}
                            onChange={onChange}
                          />
                          <div className="invalid-feedback">
                            Please enter a sub category title.
                          </div>
                        </div>
                      </Col>
                      <Col xxl={12} lg={6}>
                        <div className="mb-3">
                          <label
                            htmlFor="categorySelect"
                            className="form-label"
                          >
                            Catégorie <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select"
                            name="categorySelect"
                            id="categorySelect"
                            onChange={handleCategory}
                          >
                            <option value="">Choisir un Catégorie</option>
                            {data.map((category) => (
                              <option
                                key={category.idcategory}
                                value={category.idcategory}
                              >
                                {category.nom}
                              </option>
                            ))}
                          </select>
                          <div className="error-msg mt-n3">
                            Please select a category.
                          </div>
                        </div>
                      </Col>
                      <Col xxl={12} lg={6}>
                        <div className="mb-3">
                          <label
                            htmlFor="subDescription"
                            className="form-label"
                          >
                            Description
                          </label>
                          <input
                            className="form-control"
                            id="subDescription"
                            placeholder="Description"
                            required
                            onChange={onChange}
                            value={formData.subDescription}
                          />
                          <div className="invalid-feedback">
                            Please enter a description.
                          </div>
                        </div>
                      </Col>
                      <Col lg={12}>
                        <div className="text-end">
                          <Button
                            variant="success"
                            type="submit"
                            id="addNewCategory"
                          >
                            Ajouter
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={9}>
              <Row className="justify-content-between mb-4"></Row>
              <SubCategoriesTable />
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default SubCategories;
