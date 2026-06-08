import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import Dashboard from "../features/products/pages/Dashboard";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import ProductDetails from "../features/products/pages/ProductDetails";
import SellerProduct from "../features/products/pages/SellerProduct";


import AppleLayout from "./AppleLayout";
import Cart from "../features/cart/pages/Cart";

export const routes = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <AppleLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:productId",
        element: <ProductDetails />,
      },
       {
         path: "/cart",
         element: (
        <Protected>
         <Cart />
         </Protected>
         )
       },

      {
        path: "/seller",
        children: [
          {
            path: "create-product",
            element: (
              <Protected role="seller">
                <CreateProduct />
              </Protected>
            ),
          },
          {
            path: "dashboard",
            element: (
              <Protected role="seller">
                <Dashboard />
              </Protected>
            ),
          },
          {
            path: "product/:productId",
            element: (
              <Protected role="seller">
                <SellerProduct />
              </Protected>
            ),
          },
        ],
      },
    ],
  },
]);
//   {
//     path:"/product/:productId",
//     element:<ProductDetails/>
//   },
//   {
//     path:"/cart",
//     element:<Cart/>
//   },

//   // SELLER ROUTES
//   {
//     path: "/seller",

//     children: [
//       {
//         path: "create-product",

//         element: (
//           <Protected role="seller">
//             <CreateProduct />
//           </Protected>
//         ),
//       },

//       {
//         path: "dashboard",

//         element: (
//           <Protected role="seller">
//             <Dashboard />
//           </Protected>
//         ),
//       },
//       {
//         path:"product/:productId",
//         element:(
//         <Protected role="seller">
//           <SellerProduct/>
//         </Protected>
//         ),
//       },
//     ],

//   },

// ]);