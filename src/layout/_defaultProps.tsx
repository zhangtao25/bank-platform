import { ChromeFilled, CrownFilled, SmileFilled, TabletFilled } from '@ant-design/icons';

export default {
    route: {
        path: '/',
        routes: [
            {
                path: '/worker',
                name: 'worker',
                icon: <SmileFilled />,
            },
            {
                path: '/bank',
                name: 'bank',
                icon: <SmileFilled />,
            },
        ],
    },
    location: {
        pathname: '/',
    }
};