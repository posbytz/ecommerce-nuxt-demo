import { defineStore } from "pinia";

export const useToastStore = defineStore('toast', {
    id: 'toast-store',
    state : ()=> ({
        toast: null
    }),
    actions : {
        showToast(message) {
            this.toast = message;
            setTimeout(()=>{
                this.toast = null;
              },3000) 
        }
    }
})