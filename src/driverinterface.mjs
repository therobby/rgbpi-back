import Driver from "./driver.mjs";
import path from "path";
import fs from "fs";

export default class DriverInterface {
	constructor() {
		let config = JSON.parse(fs.readFileSync(path.join(path.resolve(path.resolve()), "config.json")));
		this.driver = new Driver(config.leds, config.gpio, config.hardware_brightness);
		this.leds = config.leds;
		this.name = config.name;
	}

	setSingleLed(index, r, g, b) {
		this.driver.setLed(index, r, g, b);
		this.driver.render();
	}

	setLeds(leds) {
		for (let i = 0; i < leds.length; i++) {
			this.driver.setLed(i, leds[i].r, leds[i].g, leds[i].b);
		}
		this.driver.render();
	}

	setAllLeds(r, g, b) {
		this.driver.setLeds(r, g, b);
		this.driver.render();
	}

	off() {
		this.driver.off();
	}

	data() {
		return { leds: this.leds, name: this.name };
	}

	changeBrightness(percent) {
		if (percent) {
			this.driver.setBrightness(percent);
		}
	}

	switchLedsOff() {
		this.off();
	}
}
