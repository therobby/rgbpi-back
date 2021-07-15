import FullRGB from "./Animations/fullrgb.mjs";
import WaveRGB from "./Animations/wavergb.mjs";
import BDotRGB from "./Animations/bdotrgb.mjs";
import BDotRGB2 from "./Animations/bdotrgb2.mjs";
import BDotRGB3 from "./Animations/bdotrgb3.mjs";
import CDotRGB from "./Animations/cdotrgb.mjs";
import CDotRGB2 from "./Animations/cdotrgb2.mjs";
import CDotRGB3 from "./Animations/cdotrgb3.mjs";
import TwoPac from "./Animations/2pac.mjs";
import TwoPacRGB from "./Animations/2pacrgb.mjs";
import Manual from "./Animations/manual.mjs";
import Flash from "./Animations/flash.mjs";
import FlashRGB from "./Animations/flashrgb.mjs";
import Police from "./Animations/police.mjs"

import DriverInterface from "./driverinterface.mjs";

export default class Controller {
	driver = { interface: new DriverInterface(), animation: null, brightness: 50, fps: 1024 };
	current_animation = null; // animation object
	animations = {};

	constructor() {
		this.animations[FullRGB.data().s_name] = FullRGB;
		this.animations[WaveRGB.data().s_name] = WaveRGB;
		this.animations[BDotRGB.data().s_name] = BDotRGB;
		this.animations[BDotRGB2.data().s_name] = BDotRGB2;
		this.animations[BDotRGB3.data().s_name] = BDotRGB3;
		this.animations[CDotRGB.data().s_name] = CDotRGB;
		this.animations[CDotRGB2.data().s_name] = CDotRGB2;
		this.animations[CDotRGB3.data().s_name] = CDotRGB3;
		this.animations[TwoPac.data().s_name] = TwoPac;
		this.animations[TwoPacRGB.data().s_name] = TwoPacRGB;
		this.animations[Manual.data().s_name] = Manual;
		this.animations[Flash.data().s_name] = Flash;
		this.animations[FlashRGB.data().s_name] = FlashRGB;
		this.animations[Police.data().s_name] = Police;
	}

	changeAnimation(s_name) {
		try {
			if(this.driver.animation && this.driver.animation.class.data().s_name != s_name){
				this.stopAnimations();
				this.driver.animation = new this.animations[s_name](this);
			} else if(!this.driver.animation){
				this.driver.animation = new this.animations[s_name](this);
			}
			// console.log(this.driver.animation);
		} catch (e) {
			console.error(e);
		}
	}

	startAnimation(data = {}) {
		if (this.driver.animation) {
			this.driver.animation.setData(data);
			if (!this.driver.animation.running) {
				this.driver.animation.start();
			}
		}
	}

	stopAnimations() {
		if (this.driver.animation && this.driver.animation.running) {
			this.driver.animation.stop();
		}
	}

	off() {
		this.driver.animation.stop();
		this.driver.interface.switchLedsOff();
	}

	setColorRGB(index, rgb) {
		this.driver.interface.setSingleLed(index, rgb.r, rgb.g, rgb.b);
	}

	setColor(index, r, g, b) {
		this.driver.interface.setSingleLed(index, r, g, b);
	}

	setColors(leds) {
		this.driver.interface.setLeds(leds);
	}

	setColorAllRGB(rgb) {
		this.driver.interface.setAllLeds(rgb.r, rgb.g, rgb.b);
	}

	setColorAll(r, g, b) {
		this.driver.interface.setAllLeds(r, g, b);
	}

	onExit() {
		this.driver.interface.off();
	}

	getAnimations() {
		let anims = [];
		Object.values(this.animations).forEach((animation) => {
			let data = animation.data();
			anims.push(data);
		});
		return anims;
	}

	getSettings() {
		return {
			brightness: this.driver.brightness,
			fps: this.driver.fps,
		};
	}

	setSettings(data) {
		// console.log({ data });
		if (data.brightness && Number(data.brightness) != Number.NaN && data.brightness >= 0 && data.brightness <= 100) {
			this.driver.brightness = Number(data.brightness);
			this.driver.interface.changeBrightness(this.driver.brightness);
		}
		if (data.fps && Number(data.fps) != Number.NaN && data.fps >= 1 && data.fps <= 2048) {
			this.driver.fps = Number(data.fps);
		}

		// console.log(this.driver);
	}

	getDriverData() {
		return {
			name: this.driver.interface.name,
			leds: this.driver.interface.leds,
		};
	}
}
