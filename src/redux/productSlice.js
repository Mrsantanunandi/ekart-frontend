import { createSlice } from "@reduxjs/toolkit";

// ===== Load from localStorage =====
const savedAddresses = JSON.parse(localStorage.getItem("addresses") || "[]");
const savedSelectedAddress = JSON.parse(
  localStorage.getItem("selectedAddress") || "null"
);
const savedCart = JSON.parse(localStorage.getItem("cart") || '{"items": [], "totalPrice": 0}');

const initialState = {
  products: [],
  cart: savedCart,
  addresses: savedAddresses,
  selectedAddress: savedSelectedAddress,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // ================= PRODUCTS =================
    setProduct: (state, action) => {
      state.products = action.payload;
    },

    addProductToStore: (state, action) => {
      state.products.push(action.payload);
    },

    // ================= CART =================
    setCart: (state, action) => {
      state.cart = {
        items: action.payload?.items || [],
        totalPrice: action.payload?.totalPrice || 0,
      };
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    clearCart: (state) => {
      state.cart = { items: [], totalPrice: 0 };
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },

    // ================= ADDRESS =================
    addAddresses: (state, action) => {
      state.addresses.push(action.payload);
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    deletedAddress: (state, action) => {
      state.addresses = state.addresses.filter(
        (_, index) => index !== action.payload
      );
      if (state.selectedAddress === action.payload) {
        state.selectedAddress = null;
        localStorage.setItem("selectedAddress", JSON.stringify(null));
      }
      localStorage.setItem("addresses", JSON.stringify(state.addresses));
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
      localStorage.setItem(
        "selectedAddress",
        JSON.stringify(state.selectedAddress)
      );
    },
  },
});

export const {
  setProduct,
  addProductToStore,
  setCart,
  clearCart,
  addAddresses,
  deletedAddress,
  setSelectedAddress,
} = productSlice.actions;

export default productSlice.reducer;
