import { reatomComponent } from "@reatom/react";
import { homeRoute } from "../entities/routes";
import { Home } from "./home";

export const Routes = reatomComponent(() => {
    return (
        <>
            {homeRoute.exact() && <Home />}
        </>
    );
})