import { create } from "zustand";
import ApiKeyService from "../../pages/APIkeys/Services/ApiKeyService";

const useApiKeyStore = create((set) => ({
    apiKeyListData: [],
    btnLoading: false,
    isLoading: true,
    error: null,
    setApiKeyList: (data) => set({ apiKeyListData: data }),
    setIsLoading: (isLoading) => set({ isLoading }),
    ...ApiKeyService(set),
}));

export default useApiKeyStore;
