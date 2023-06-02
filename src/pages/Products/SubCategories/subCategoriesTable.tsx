import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { subCategoryListData } from "Common/data";
import TableContainer from "Common/TableContainer";
import {
  useDeleteSubCategoryMutation,
  useFetchSubCategoriesQuery,
  useUpdateSubCategoryMutation,
} from "features/subCategory/subCategorySlice";
import { Table } from "react-bootstrap";

const SubCategoriesTable = () => {
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const { data, error, isLoading, isFetching, isSuccess } =
    useFetchSubCategoriesQuery();

  const deleteHandler = async (id: any) => {
    await deleteSubCategory(id);
  };

  const subCategoryUpdated = {
    idSubCategory: 10,
    title: "Sub Category 11",
    subDescription: "Sub Category For Category 17",
    parentID: 17,
    nom: "peinture",
  };
  // const SubCategoriesTable = () => {
  //   const columns = useMemo(() => [
  //     {
  //       Header: "Id",
  //       Filter: true,
  //       Cell: (cellProps: any) => {
  //         return (
  //           <span>
  //             <div className="fw-medium">{cellProps.row.original.subCategoryId}</div>
  //           </span>
  //         );
  //       },
  //     },
  //     {
  //       Header: "Subcategory",
  //       accessor: "subcategory",
  //       Filter: true,
  //     },
  //     {
  //       Header: "Category",
  //       accessor: "category",
  //       Filter: true,
  //     },
  //     {
  //       Header: "Craetedby",
  //       accessor: "craetedby",
  //       Filter: true
  //     },
  //     {
  //       Header: "Action",
  //       Filter: false,
  //       Cell: (cellProps: any) => {
  //         return (
  //           <span>
  //             <ul className="hstack gap-2 list-unstyled mb-0">
  //               <li>
  //                 <Link to="#" className="badge badge-soft-success">Edit</Link>
  //               </li>
  //               <li>
  //                 <Link to="#" className="badge badge-soft-danger">Delete</Link>
  //               </li>
  //             </ul>
  //           </span>
  //         );
  //       },
  //     }
  //   ],
  //     []
  //   );
  //   return (
  //     <React.Fragment>
  //       <div>
  //         <TableContainer
  //           columns={columns}
  //           data={(subCategoryListData || [])}
  //           // isGlobalFilter={true}
  //           customPageSize={10}
  //           // divClassName="table-responsive mb-1"
  //           tableClassName="gridjs-table"
  //           theadClassName="gridjs-thead"
  //           SearchPlaceholder='Search Products...'
  //         />
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  return (
    <React.Fragment>
      {error && <h2>Something went wrong!</h2>}
      <div className="table-responsive">
        <Table className="align-middle table-nowrap mb-0">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((subcategory) => (
              <tr key={subcategory.idSubCategory}>
                <td>{subcategory.idSubCategory}</td>
                <td>{subcategory.title}</td>
                <td>{subcategory.subDescription}</td>
                <td>{subcategory.parentID}</td>
                <td>
                  <ul className="hstack gap-2 list-unstyled mb-0">
                    {/* <li>
                                  <Link to="#" className="link-success">View More <i className="ri-arrow-right-line align-middle"></i></Link>
                                </li>
                                <li>
                                  <Link onClick={updateHandler} to="#" className="badge badge-soft-success">Edit</Link>
                                </li> */}
                    <li>
                      <Link
                        onClick={() => deleteHandler(subcategory.idSubCategory)}
                        to="#"
                        className="badge badge-soft-danger"
                      >
                        Supprimer
                      </Link>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </React.Fragment>
  );
};

export default SubCategoriesTable;