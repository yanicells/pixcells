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

export type BackgroundStore = {
  useSimpleBackground: boolean
  toggleBackground: () => void
}

export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set) => ({
      useSimpleBackground: false,
      toggleBackground: () =>
        set((state) => ({ useSimpleBackground: !state.useSimpleBackground })),
    }),
    {
      name: "background-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
)