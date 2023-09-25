import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";

const routes = [
  {
    path: "/",
    component: lazy(() => import("@/views/home/index.tsx")),
  },
  {
    path: "/login",
    component: lazy(() => import("@/views/login/index.tsx")),
  },
];

// 路由处理方式
const generateRouter = (routes: any) => {
  return routes.map((item: any) => {
    if (item.children) {
      item.children = generateRouter(item.children);
    }
    item.element = (
      <Suspense fallback={<div style={{ fontSize: "6px" }}>美女请稍等...</div>}>
        {/* 把懒加载的异步路由变成组件装载进去 */}
        <item.component />
      </Suspense>
    );
    return item;
  });
};

const Router = () => useRoutes(generateRouter(routes));

export { Router };
