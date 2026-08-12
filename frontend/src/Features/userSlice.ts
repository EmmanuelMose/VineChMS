import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    maritalStatus?: string;
    occupation?: string;
    address?: string;
    profilePicture?: string;
    profilePicturePublicId?: string;
    churchId?: number;
    organizationId?: number;
    largeOrganizationId?: number;
    isActive: boolean;
    isVerified: boolean;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserState["user"]; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<UserState["user"]>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    refreshUser: (state, action: PayloadAction<{ user: UserState["user"]; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
});

export const { setUser, clearUser, setLoading, updateUser, refreshUser } = userSlice.actions;
export default userSlice.reducer;