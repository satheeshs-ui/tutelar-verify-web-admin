import { create } from "zustand";
import CaseService from "../../pages/Cases/Services/CaseService";

const useCaseStore = create((set) => ({
    caseDetails: {},
    caseList: [],
    reportDetail: {},
    caseCompletedStatusData: {},
    documentUpload: [],
    btnLoading: false,
    isLoading: true,
    errorCode: null,
    error: null,
    sessionExpired: false,
    sessionTime: null,
    connectionError: null,
    isSummaryVerificationPending: false,
    redirectionPending: false,
    agentSlotList: [],
    availableSlots: {},
    setRedirectionPending: (data) => set({ redirectionPending: data }),
    setConnectionError: (data) => set({ connectionError: data }),
    setCaseData: (data) => set({ caseDetails: data }),
    setCaseList: (data) => set({ caseList: data }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setCustomerDevice: (data) => set({ customerDevice: data }),
    setSessionExpired: (data) => set({ sessionExpired: data }),
    setSessionTime: (data) => set({ sessionTime: data }),
    ...CaseService(set),
}));

export default useCaseStore;
