import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      user: "",
      name: "",
      setUserType: (user, name) => {
        set({ user, name });
      },
      loadFromLocalStorage: () => {
        try {
          const serializedState = localStorage.getItem("zustandState");
          return serializedState ? JSON.parse(serializedState) : undefined;
        } catch (error) {
          console.error(
            "Error loading Zustand state from local storage:",
            error
          );
          return undefined;
        }
      },
      saveToLocalStorage: (state) => {
        try {
          const serializedState = JSON.stringify(state);
          localStorage.setItem("zustandState", serializedState);
        } catch (error) {
          console.error("Error saving Zusta nd state to local storage:", error);
        }
      },
    }),
    {
      name: "userDataZustand",
    }
  )
);
