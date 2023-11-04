// external imports
import colors from "@colors/colors";

// internal imports============
import app from "./app";
import dbconnection from "./utils/dbconnection";

async function server() {
  // database connection======
  dbconnection();
  // app listener
  app.listen(process.env.port, () => {
    console.log(
      colors.magenta(
        `Example app listening on port ${process.env.port}`.magenta
      )
    );
  });
}

server().catch((e) => console.log("Error:::::::", e));

process.on("unhandledRejection", (e) => console.log("Promise rejected: ", e));
