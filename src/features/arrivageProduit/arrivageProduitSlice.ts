import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ArrivageProduit {
  idArrivageProduit: number;
  produitID: number;
  arrivageID: number;
  quantite: number;
  piecejointes: string;
  nomProduit: string;
  prixAchatHt: number;
  prixAchatTtc: number;
  prixVente: number;
  remise: number;
  PourcentageBenifice: number;
  Benifice: number;
  PrixRemise: number;
  PourcentageRemise: number;
  MontantTotalProduit: number;
  MontantTotal: number;
}

export const arrivageProduitSlice = createApi({
  reducerPath: "arrivageProduit",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/arrivageProduit/",
  }),
  tagTypes: ["ArrivageProduit"],
  endpoints(builder) {
    return {
      getAllArrivagesProduit: builder.query<ArrivageProduit[], number | void>({
        query() {
          return "/allArrivageProduit";
        },
        providesTags: ["ArrivageProduit"],
      }),
      getOneArrivageProduit: builder.query<ArrivageProduit, number | void>({
        query(idArrivageProduit) {
          return `/oneArrivage/${idArrivageProduit}`;
        },
        providesTags: ["ArrivageProduit"],
      }),
      addArrivageProduit: builder.mutation<void, ArrivageProduit>({
        query(payload) {
          return {
            url: "/newArrivageProduit",
            method: "POST",
            body: payload,
          };
        },
        invalidatesTags: ["ArrivageProduit"],
      }),
      updateArrivageProduit: builder.mutation<void, ArrivageProduit>({
        query: ({ idArrivageProduit, ...rest }) => ({
          url: `/updateArrivageProduit/${idArrivageProduit}`,
          method: "PATCH",
          body: rest,
        }),
        invalidatesTags: ["ArrivageProduit"],
      }),
      deleteArrivageProduit: builder.mutation<void, number>({
        query: (idArrivageProduit) => ({
          url: `removeArrivageProduit/${idArrivageProduit}`,
          method: "DELETE",
        }),
        invalidatesTags: ["ArrivageProduit"],
      }),
    };
  },
});

export const {
  useGetAllArrivagesProduitQuery,
  useGetOneArrivageProduitQuery,
  useAddArrivageProduitMutation,
  useDeleteArrivageProduitMutation,
  useUpdateArrivageProduitMutation,
} = arrivageProduitSlice;
