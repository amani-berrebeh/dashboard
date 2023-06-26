import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Produit {
  idproduit: number;
  nomProduit: string;
  imageProduit: string;
  marque: string;
  remarqueProduit: string;
  categoryID?: number;
  nom?: string;
  sousCategoryID?: number;
  title?: string;
}

export const produitSlice = createApi({
  reducerPath: "produit",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/product/",
  }),
  tagTypes: ["Produit"],
  endpoints(builder) {
    return {
      fetchProduits: builder.query<Produit[], number | void>({
        query() {
          return `/getAllProducts`;
        },
        providesTags: ["Produit"],
      }),
      getProduit: builder.query<Produit, number>({
        query: (idproduit) => `getOneProduct/${idproduit}`,
        providesTags: (result, error, idproduit) => [
          { type: "Produit", idproduit },
        ],
      }),
      addProduit: builder.mutation<void, Produit>({
        query(payload) {
          return {
            url: "/newProduct",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["Produit"],
      }),
      updateProduit: builder.mutation<
        void,
        Pick<Produit, "idproduit"> & Partial<Produit>
      >({
        query: ({ idproduit, ...patch }) => ({
          url: `posts/${idproduit}`,
          method: "PUT",
          body: patch,
        }),
        async onQueryStarted(
          { idproduit, ...patch },
          { dispatch, queryFulfilled }
        ) {
          const patchResult = dispatch(
            produitSlice.util.updateQueryData(
              "getProduit",
              idproduit,
              (draft) => {
                Object.assign(draft, patch);
              }
            )
          );
          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        },
        invalidatesTags: (result, error, { idproduit }) => [
          { type: "Produit", idproduit },
        ],
      }),
      deleteProduit: builder.mutation<void, number>({
        query: (idproduit) => ({
          url: `deleteproduct/${idproduit}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Produit"],
      }),
    };
  },
});

export const {
  useGetProduitQuery,
  useFetchProduitsQuery,
  useAddProduitMutation,
  useDeleteProduitMutation,
  useUpdateProduitMutation,
} = produitSlice;