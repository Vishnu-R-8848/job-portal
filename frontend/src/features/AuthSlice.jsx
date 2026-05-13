import { createSlice } from "@reduxjs/toolkit";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const normalizeUser = (payload) => {
  const user = payload?.user || payload?.data?.user || payload;

  if (!user) {
    return null;
  }

  return {
    ...user,
    candidateProfile: {
      ...(user.candidateProfile || {}),
      appliedJobs: user.candidateProfile?.appliedJobs || [],
      savedJobs: user.candidateProfile?.savedJobs || [],
    },
    notifications: user.notifications || [],
  };
};

const persistUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

const initialState = {
  user: getStoredUser(),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isProfileComplete: false,
};

const authSlice = createSlice({
  name: "isAuth",

  initialState,

  reducers: {
    addUser: (state, action) => {
      state.user = normalizeUser(action.payload);
      state.isAuthenticated = true;

      state.isProfileComplete =
        !!state.user?.profile ||
        !!state.user?.profileCompleted ||
        !!state.user?.isProfileComplete;

      persistUser(state.user);
    },

    removeUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isProfileComplete = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },

    updateUser: (state, action) => {
      const updatedUser = normalizeUser(action.payload);
      state.user = {
        ...state.user,
        ...updatedUser,
        role: updatedUser?.role || state.user?.role,
      };

      state.isProfileComplete =
        !!state.user?.profile ||
        !!state.user?.profileCompleted ||
        !!state.user?.isProfileComplete;

      persistUser(state.user);
    },

    applyForJob: (state, action) => {
      const jobId = action.payload;

      if (state.user) {
        if (!state.user.candidateProfile) {
          state.user.candidateProfile = {};
        }

        if (!state.user.candidateProfile.appliedJobs) {
          state.user.candidateProfile.appliedJobs = [];
        }

        if (!state.user.candidateProfile.appliedJobs.includes(jobId)) {
          state.user.candidateProfile.appliedJobs.push(jobId);
        }

        persistUser(state.user);
      }
    },

    saveJob: (state, action) => {
      const jobId = action.payload;

      if (state.user) {
        if (!state.user.candidateProfile) {
          state.user.candidateProfile = {};
        }

        if (!state.user.candidateProfile.savedJobs) {
          state.user.candidateProfile.savedJobs = [];
        }

        if (!state.user.candidateProfile.savedJobs.includes(jobId)) {
          state.user.candidateProfile.savedJobs.push(jobId);
        }

        persistUser(state.user);
      }
    },

    unsaveJob: (state, action) => {
      const jobId = action.payload;

      if (state.user?.candidateProfile?.savedJobs) {
        state.user.candidateProfile.savedJobs =
          state.user.candidateProfile.savedJobs.filter((id) => id !== jobId);

        persistUser(state.user);
      }
    },

    addNotification: (state, action) => {
      if (state.user) {
        if (!state.user.notifications) {
          state.user.notifications = [];
        }

        state.user.notifications.unshift({
          id: Date.now().toString(),
          message: action.payload.message,
          type: action.payload.type || "info",
          isRead: false,
          createdAt: new Date().toISOString(),
        });

        persistUser(state.user);
      }
    },

    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;

      if (state.user?.notifications) {
        const notification = state.user.notifications.find(
          (n) => n.id === notificationId,
        );

        if (notification) {
          notification.isRead = true;
          persistUser(state.user);
        }
      }
    },

    clearAllNotifications: (state) => {
      if (state.user) {
        state.user.notifications = [];
        persistUser(state.user);
      }
    },
  },
});

export const {
  addUser,
  removeUser,
  updateUser,
  applyForJob,
  saveJob,
  unsaveJob,
  addNotification,
  markNotificationAsRead,
  clearAllNotifications,
} = authSlice.actions;

export default authSlice.reducer;
