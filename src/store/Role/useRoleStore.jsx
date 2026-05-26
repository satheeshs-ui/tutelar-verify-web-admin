import { create } from "zustand";
import RoleService from "../../pages/Roles/Services/RoleService";

const useRoleStore = create((set) => ({
    roleList: [],
    roleDetails: {},
    btnloading: false,
    isLoading: false,

    setRoleList: (data) => set({ roleList: data }),
    setLoading: (val) => set({ isLoading: val }),
    ...RoleService(set),
}));
export default useRoleStore;
