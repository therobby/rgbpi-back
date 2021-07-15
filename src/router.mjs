import Express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import process from "process";

export default class Router {
	constructor(controller) {
		this.controller = controller;
		this.app = Express();
		this.app.use(cors());
		/*var allowedOrigins = ["http://localhost:3000", "rgbpi"];
		this.app.use(
			cors({
				origin: function (origin, callback) {
					return callback(null, true);
					// allow requests with no origin
					// (like mobile apps or curl requests)
					console.log("Access from: " + origin);
					if (!origin) return callback(null, true);
					if (allowedOrigins.indexOf(origin) === -1) {
						var msg = "The CORS policy for this site does not " + "allow access from the specified Origin.";
						return callback(new Error(msg), false);
					}
					return callback(null, true);
				},
			})
		);*/
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());

		this.app.get("/animation", this.getAnimations.bind(this));
		this.app.post("/animation", this.setAnimation.bind(this));
		this.app.get("/settings", this.getSettings.bind(this));
		this.app.post("/settings", this.setSettings.bind(this));
		this.app.get("/data", this.getData.bind(this));
		this.app.get("/off", this.off.bind(this));
		this.onExit.bind(this);
	}

	setAnimation(request, respond) {
		respond.status(200);
		let anim_obj = request.body;
		console.log(anim_obj);
		if (anim_obj && anim_obj.type && anim_obj.type === "Animation") {

			if (anim_obj.name && anim_obj.data) {
				// console.log(anim_obj);
				this.controller.changeAnimation(anim_obj.name);
				this.controller.startAnimation(anim_obj.data);
			}
		}
		respond.end();
	}

	getAnimations(request, respond) {
		respond.status(200);
		respond.send({
			type: "Animations",
			data: this.controller.getAnimations(),
		});
	}

	getSettings(request, respond) {
		//
		respond.status(200);
		respond.send({
			type: "Settings",
			data: this.controller.getSettings(),
		});
	}

	setSettings(request, respond) {
		//
		respond.status(200);
		let settings_obj = request.body;
		if (settings_obj && settings_obj.type && settings_obj.type === "Settings") {
			if (settings_obj.data) {
				if (settings_obj.data.brightness && settings_obj.data.fps) {
					this.controller.setSettings(settings_obj.data);
				}
			}
		}
		respond.end();
	}

	getData(request, respond) {
		//
		respond.status(200);
		respond.send({
			type: "Data",
			data: {
				drivers: this.controller.getDriverData(),
			},
		});
	}

	off(request, respond) {
		//
		respond.status(200);
		this.controller.stopAnimations();
		this.controller.driver.interface.off();
		respond.end();
	}

	onExit() {
		console.log("On exit called");
		this.controller.onExit();
		process.exit();
	}
}
