import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import userSvc from "../services/Auth.service";

// --- Interfaces & Types ---

export type IGerUserProps = {
  role?: string | null;
  search?: string | null;
  page: number;
  limit: number;
};

interface IPagination {
  total: number;
  totalPages: number;
}

interface IUserState {
  allUsers: any[] | null;
  pagination: IPagination | null;
  currentUser: any | null;   // The person you are CHATTING with
  loggedInUser: any | null;  // ✅ ADDED: The person currently LOGGED IN (You)
  loading: boolean;
}

// --- Async Thunk ---

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (query: IGerUserProps, { rejectWithValue }) => {
    try {
      const response = await userSvc.getRequest("/auth/user", {
        params: {
          role: query.role || null,
          search: query.search || null,
          page: query.page || 1,
          limit: query.limit || 10,
        },
      });
      return response; 
    } catch (exception: any) {
      return rejectWithValue(exception.response?.data || "Failed to fetch users");
    }
  }
);

// --- Initial State ---

const initialState: IUserState = {
  allUsers: null,
  pagination: null,
  currentUser: null,
  loggedInUser: null, // ✅ Initialized as null
  loading: false,
};

// --- Slice ---

const UserSlicer = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to set the chat partner
    assignCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
    // ✅ ADDED: Action to set the logged-in user (Admin/Me)
    assignLoggedInUser: (state, action: PayloadAction<any>) => {
      state.loggedInUser = action.payload;
    },
    clearUserList: (state) => {
      state.allUsers = null;
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action: any) => {
        state.loading = false;
        
        const fetchedUsers = action.payload?.data?.Users || [];
        const totalUsers = action.payload?.data?.TotalUsers || 0;
        const limit = action.meta.arg.limit || 10;

        state.allUsers = fetchedUsers;
        state.pagination = {
          total: totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        };
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.loading = false;
        state.allUsers = [];
      });
  },
});

export const { assignCurrentUser, assignLoggedInUser, clearUserList } = UserSlicer.actions;
export default UserSlicer.reducer;