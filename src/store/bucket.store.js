import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useBucketStore = create(
    persist(
        (set) => ({
            onlineCustomers: [],
            clickedCustomerName: null,
            // setOnlineCustomers: (newItem) =>
            //   set((prev) => {
            //     const exists = prev?.onlineCustomers?.some((item) => item.caseId === newItem.caseId);

            //     if (exists) {
            //       return {
            //         onlineCustomers: prev?.onlineCustomers?.map((item) =>
            //           item.caseId === newItem.caseId ? newItem : item
            //         ),
            //       };
            //     }

            //     return {
            //       onlineCustomers: [...prev.onlineCustomers, newItem],
            //     };
            //   }),

            // setOnlineCustomers: (payload) =>
            //     set((state) => {
            //         const incoming = (Array.isArray(payload) ? payload : [payload]).filter(
            //             (item) =>
            //                 item &&
            //                 typeof item === "object" &&
            //                 Object.keys(item).length > 0 &&
            //                 item.caseId
            //         );

            //         const map = new Map(state.onlineCustomers.map((item) => [item.caseId, item]));

            //         incoming.forEach((item) => {
            //             map.set(item.caseId, item);
            //         });

            //         return {
            //             onlineCustomers: Array.from(map.values()),
            //         };
            //     }),

            setClickedCustomerName: (clickedCustomerName) =>
                set({
                    clickedCustomerName: clickedCustomerName,
                }),

            removeOnlineCustomer: (id) =>
                set((prev) => ({
                    onlineCustomers: prev.onlineCustomers.filter((item) => item.caseId !== id),
                })),

            clearAppStore: () =>
                set({
                    onlineCustomers: null,
                }),
        }),
        {
            name: "bucket-storage",
        }
    )
);
