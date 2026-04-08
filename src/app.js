require("dotenv").config();

const listEndpoints = require("express-list-endpoints");
const swaggerUi = require("swagger-ui-express");
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss");
const hpp = require("hpp");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");

const { admin, router } = require("./admin/admin");
const callRoutes = require("./routes/call.routes");
const initSocket = require("./sockets/socket.server");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const blockRoutes = require("./routes/block.routes");
const reportRoutes = require("./routes/report.routes");
const moderationRoutes = require("./routes/moderation.routes");

const app = express();

connectDB();

const server = http.createServer(app);
initSocket(server);


// BODY LIMIT
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));


// SECURITY HEADERS
app.use(helmet());


// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));


// LOGGER
app.use(morgan("dev"));


// RATE LIMIT (API abuse protection)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use("/api", limiter);


// MONGO INJECTION PROTECTION
function sanitize(obj) {
  if (!obj) return obj;

  Object.keys(obj).forEach((key) => {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    }

    if (typeof obj[key] === "object") {
      sanitize(obj[key]);
    }
  });

  return obj;
}

app.use((req, res, next) => {
  sanitize(req.body);
  sanitize(req.params);
  next();
});


// XSS PROTECTION
app.use((req, res, next) => {

  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  next();
});


// HTTP PARAMETER POLLUTION
app.use(hpp());


// RESPONSE COMPRESSION
app.use(compression());


// ADMIN PANEL
if (process.env.ENABLE_ADMIN === "true") {
  app.use(admin.options.rootPath, router);
  console.log("Admin panel enabled at:", admin.options.rootPath);
} else {
  console.log("Admin panel disabled");
}


// MEDIA ROUTES
app.use("/uploads", express.static("uploads"));

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/block", blockRoutes);
app.use("/api/reports", reportRoutes);        // user reports
app.use("/api/moderation", moderationRoutes); // admin/system moderation
app.use("/api/call", callRoutes);


// DEBUG ROUTES
app.get("/routes", (req, res) => {

  const routes = [];

  const router = app._router || app.router;

  if (!router || !router.stack) {
    return res.json(routes);
  }

  router.stack.forEach((layer) => {

    if (layer.route) {
      routes.push({
        path: layer.route.path,
        methods: Object.keys(layer.route.methods).map(m => m.toUpperCase())
      });
    }

    else if (layer.name === "router" && layer.handle?.stack) {

      layer.handle.stack.forEach((handler) => {

        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods).map(m => m.toUpperCase())
          });
        }

      });

    }

  });

  res.json(routes);
});


app.get("/dev/routes", (req, res) => {
  const getRoutes = require("./utils/routeDebugger");
  res.json(getRoutes(app));
});


app.get("/test", (req, res) => {
  res.json({ status: "working" });
});


// SWAGGER DOCS
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});


// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  // setTimeout(() => {
  //   console.log("Available Routes:");
  //   console.log(listEndpoints(app));
  // }, 1000);
});
