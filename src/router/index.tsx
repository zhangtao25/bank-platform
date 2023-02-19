import Worker from '../pages/worker/Worker'
import Bank from '../pages/bank/Bank'
import Login from '../pages/Login'
import BankCreateAndUpdate from '../pages/bank/BankCreateAndUpdate'
import WorkerCreateAndUpdate from '../pages/worker/WorkerCreateAndUpdate'
const router = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/Worker',
        element: <Worker />,
    },
    {
        path: '/Worker/:worker_id',
        element: <WorkerCreateAndUpdate />,
    },
    {
        path: '/Bank',
        element: <Bank />,
    },
    {
        path: '/Bank/:card_id',
        element: <BankCreateAndUpdate />,
    },
]
export default router
