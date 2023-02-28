import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
    id: 'modal-store',
    state: () => ({
        searchModal: null
    }),
    actions: {
        showSearchToast() {
            this.searchModal = true
        },
        hideSearchToast() {
            this.searchModal = false
        }
    }
})