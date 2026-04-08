function getRoutes(app) {
    const routes = [];

    const stack = app._router?.stack || [];

    stack.forEach((layer) => {

        if (layer.route) {
            const path = layer.route.path;
            const methods = Object.keys(layer.route.methods).map(m => m.toUpperCase());

            routes.push({
                method: methods.join(", "),
                path
            });
        }

        else if (layer.name === "router" && layer.handle?.stack) {

            layer.handle.stack.forEach((handler) => {

                if (handler.route) {
                    const path = handler.route.path;
                    const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase());

                    routes.push({
                        method: methods.join(", "),
                        path
                    });
                }

            });

        }

    });

    return routes;
}

module.exports = getRoutes;