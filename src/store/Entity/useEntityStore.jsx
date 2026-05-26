import { create } from "zustand";
import DocConfiguration from "../../pages/DocConfiguration/Services/EntityService";

const useEntityStore = create((set) => ({
    entityList: [],
    ...DocConfiguration(set),
}));

export default useEntityStore;
