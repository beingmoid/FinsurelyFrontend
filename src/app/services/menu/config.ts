export const getMenuData: any[] = [

    {
        title: 'Dashboard',
        key: 'home',
        icon: 'fa fa-home',
        url: '/',
    },
    {
        title: 'Branch',
        key: 'branch',
        icon: 'fa fa-th-large',
        url: '/branch',
    },
    {
        title: 'Sales Agent',
        key: 'sales-agent',
        icon: 'fa fa-user-secret',
        url: '/sales-agent',
    },
    {
        title: 'Insurance Company',
        key: 'sales-agent',
        icon: 'fa fa-industry',
        url: '/insurance-company',
    },
    // {
    //     title: 'Supplier',
    //     key: 'supplier',
    //     icon: 'fa fa-truck',

    //     url: '/supplier',
    // },
    {
        title: 'Sales',
        key: 'sales',
        icon: 'fa fa-paper-plane',
        url: '/sales',
    },

    {
        title: 'Transactions',
        key: 'sales',
        icon: 'fa fa-exchange',
        url: '/transactions',
    },
    // {
    //     title: 'Calendar',
    //     key: 'calender',
    //     icon: 'fa fa-calendar-check-o',
    //     url: '/calendar',
    // },
    {
        title: 'Task',
        key: 'task',
        icon: 'fa fa-tasks',
        url: '/tasks',
    },
    {
        title: 'Documents',
        key: 'documents',
        icon: 'fa fa-file',
        url: '/documents',
    },
    {
        title: 'Expenses',
        key: 'expense',
        icon: 'fa fa-credit-card-alt',
        url: '/expenses',
    },
    {
        title: 'Accounting',
        key: 'accounting',
        icon: 'fe fe-book',
        url: '/accounting',
    },
    {
        title: 'Workplace',
        key: 'employees',
        icon: 'fa fa-suitcase',
        url: '/workplace',
    },
    {
        title: 'Reports',
        key: 'reports',
        icon: 'fa fa-bar-chart',
        url: '/report',
    },

    // {
    //     title: 'Forms',
    //     key: 'forms',
    //     icon: 'fe fe-file-text',
    //     url: '/forms',
    // },
    // {
    //     title: 'Team Members',
    //     key: 'teamMembers',
    //     icon: 'fe fe-user-check',
    //     url: '/team',
    // },
    // {
    //     title: 'Analytics',
    //     key: 'analytics',
    //     icon: 'fe fe-trending-up',
    //     url: '/analytics',
    // },
    // {
    //     title: 'Immigration News',
    //     key: 'immigrationNews',
    //     icon: 'fe fe-list',
    //     url: '/news',
    // },
    // {
    //     title: 'History',
    //     key: 'history',
    //     icon: 'fe fe-rotate-ccw',
    //     url: '/history',
    // },
    // {
    //     title: 'Login History',
    //     key: 'loginHistory',
    //     icon: 'fe fe-clock',
    //     url: '/history/login',
    // },
    {
        category: true,
        title: ''
    },
    {
        title: 'Settings',      // item title
        key: 'settings',        // key (required by antd menu)
        icon: 'fe fe-more-horizontal',       // icon class
        // roles: ['admin'],         // set user roles with access to this route
        // count: 4,                 // item badge
        children: [               // render submenu
            {
                title: 'User Settings',
                key: 'user-settings',
                url: '/settings/user',
            },
            // {
            //     title: 'Plan Settings',
            //     key: 'plan-settings',
            //     url: '/settings/plan',
            // },
            // {
            //     title: 'Billing History',
            //     key: 'billing-history',
            //     url: '/settings/billing-history',
            // },
            {
                title: 'Logout',
                key: 'logout',
                url: '/settings/logout',
            },
        ]
    },

]

// Reference Item
// {
//     category: true,           // render category
//         title: 'Dashboards',      // category title
//   },
// {
//     title: 'Dashboards',      // item title
//         key: 'dashboards',        // key (required by antd menu)
//             icon: 'fe fe-home',       // icon class
//                 roles: ['admin'],         // set user roles with access to this route
//                     count: 4,                 // item badge
//                         children: [               // render submenu
//                             {
//                                 title: 'Dashboard Alpha',
//                                 key: 'dashboard',
//                                 url: '/dashboard/alpha',
//                             },
//                             ...
//     ]
// },
