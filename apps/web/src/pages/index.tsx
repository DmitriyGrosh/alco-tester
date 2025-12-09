import { reatomComponent } from "@reatom/react";
import { homeRoute } from "../entities/viewer";
import { Home } from "./home";

export const Routes = reatomComponent(() => {
    return (
        <>
            {homeRoute.exact() && <Home />}
        </>
    );
})