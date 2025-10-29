import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type ButtonStore = {
  isToggled: boolean
  toggle: () => void
}

export const useButtonStore = create<ButtonStore>()(
  persist(
    (set) => ({
      isToggled: false,
      toggle: () => set((state) => ({ isToggled: !state.isToggled })),
    }),
    {
      name: "button-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
