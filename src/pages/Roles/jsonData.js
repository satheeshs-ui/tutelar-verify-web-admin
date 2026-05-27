export const menulistJsonData = [
  {
    menuName: "Dashboard",
    menuIcon: "Users",

    childMenus: [
      {
        id: "MENU_AG_LIST_04",
         menuName: "Dashboard",
        permissions: {
          read: false,
          write: false,
        },
      },
    ],
  },

  {
    menuName: "Clients",
    menuIcon: "Key",
    childMenus: [
      {
        id: "MENU_AG_API_LIST_08",
         menuName: "Clients",
        permissions: {
          read: false,
          write: false,
        },
      },
    ],
  },
  {
    menuName: "User Configuration",
    menuIcon: "Users",
    childMenus: [
      {
        id: "MENU_CONF_01",
        menuName: "Roles and Permissions",
        permissions: {
          read: false,
          write: false,
        },
      },
      {
        id: "MENU_CONF_02",
        menuName: "Users",
        permissions: {
          read: false,
          write: false,
        },
      },
      {
        id: "MENU_CONF_03",
        menuName: "Designation",
        permissions: {
          read: false,
          write: false,
        },
      },
      {
        id: "MENU_CONF_04",
        menuName: "Department",
        permissions: {
          read: false,
          write: false,
        },
      },
    ],
  },
  {
    menuName: "Profile Check",
    menuIcon: "BarChart3",
    childMenus: [
      {
        id: "MENU_AG_DR",
        menuName: "Profile Check",
        permissions: {
          read: false,
          write: false,
        },
      },
    ],
  },
];
