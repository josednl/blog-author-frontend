import { createBrowserRouter } from 'react-router-dom';
import App from '@/app/App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <div></div>,
      },
      // {
      //   path: '',
      //   element: ,
      //   loader: ,
      //   errorElement: ,
      // },
    ]
  }
]);

export default router;
