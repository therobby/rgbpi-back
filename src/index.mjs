import fs from "fs";
import path from "path";

import Routing from "./router.mjs";
import Controller from "./controller.mjs";
// import DriverController from "./drivercontroller.mjs";

let config = JSON.parse(fs.readFileSync(path.join(path.resolve(path.resolve()), "config.json")));

console.log({ config });

global.LANG = "";

switch (config.lang) {
	case "pl":
		LANG = JSON.parse(fs.readFileSync(path.join(path.resolve(path.resolve()), "/lang/pl.json")));
		break;
	case "en":
		LANG = JSON.parse(fs.readFileSync(path.join(path.resolve(path.resolve()), "/lang/en.json")));
		break;
	default:
		LANG = JSON.parse(fs.readFileSync(path.join(path.resolve(path.resolve()), "/lang/pl.json")));
		break;
}

// const driver = new DriverController();
const controller = new Controller();

// controller.addDriver(driver);

const routing = new Routing(controller);

console.log(controller);

process.on("SIGINT", routing.onExit.bind(routing));
process.on("SIGUSR1", routing.onExit.bind(routing));
process.on("SIGUSR2", routing.onExit.bind(routing));
// process.on("uncaughtException", onExit.bind(routing));
process.on("beforeExit", routing.onExit.bind(routing));

routing.app.listen(config.port, () => {
	console.log("Running on " + config.port);
});
