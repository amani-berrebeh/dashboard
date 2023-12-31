import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import LayoutReducer from "../slices/layouts/reducer";
import CalendarReducer from "../slices/calendar/reducer";
// Authentication
import LoginReducer from "../slices/auth/login/reducer";
import AccountReducer from "../slices/auth/register/reducer";
import ForgetPasswordReducer from "../slices/auth/forgetpwd/reducer";
import ProfileReducer from "../slices/auth/profile/reducer";
import DashboardReducer from "../slices/dashboard/reducer";
import { categorySlice } from "../features/category/categorySlice";
import { subCategorySlice } from "features/subCategory/subCategorySlice";
import { produitSlice } from "../features/produit/productSlice";
import { fournisseurSlice } from "../features/fournisseur/fournisseurSlice";
import { clientPhysiqueSlice } from "../features/clientPhysique/clientPhysiqueSlice";
import { chargesSlice } from "../features/charge/chargeSlice";
import { clientMoraleSlice } from "../features/clientMoral/clientMoralSlice";
import { arrivageSlice } from "../features/arrivage/arrivageSlice";
import { facturetSlice } from "features/facture/factureSlice";
import { arrivageProduitSlice } from "features/arrivageProduit/arrivageProduitSlice";
export const store = configureStore({
  reducer: {
    [categorySlice.reducerPath]: categorySlice.reducer,
    [subCategorySlice.reducerPath]: subCategorySlice.reducer,
    [produitSlice.reducerPath]: produitSlice.reducer,
    [fournisseurSlice.reducerPath]: fournisseurSlice.reducer,
    [clientPhysiqueSlice.reducerPath]: clientPhysiqueSlice.reducer,
    [chargesSlice.reducerPath]: chargesSlice.reducer,
    [clientMoraleSlice.reducerPath]: clientMoraleSlice.reducer,
    [arrivageSlice.reducerPath]: arrivageSlice.reducer,
    [facturetSlice.reducerPath]: facturetSlice.reducer,
    [arrivageProduitSlice.reducerPath]: arrivageProduitSlice.reducer,
    Layout: LayoutReducer,
    Calendar: CalendarReducer,
    Login: LoginReducer,
    Account: AccountReducer,
    ForgetPassword: ForgetPasswordReducer,
    Profile: ProfileReducer,
    Dashboard: DashboardReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat([
      categorySlice.middleware,
      subCategorySlice.middleware,
      produitSlice.middleware,
      fournisseurSlice.middleware,
      clientPhysiqueSlice.middleware,
      chargesSlice.middleware,
      clientMoraleSlice.middleware,
      arrivageSlice.middleware,
      facturetSlice.middleware,
      arrivageProduitSlice.middleware,
    ]);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
