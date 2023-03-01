import { defineStore } from "pinia";

export const useModalStore = defineStore('modal', {
    id: 'modal-store',
    state: () => ({
        searchModal: null
    }),
    actions: {
        showSearchToast() {
            this.searchModal = true
            document.body.classList.add('overflow-hidden');
        },
        hideSearchToast() {
            this.searchModal = false
            document.body.classList.remove('overflow-hidden');
        }
    }
})