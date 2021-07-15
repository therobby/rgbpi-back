// import ws281x from "rpi-ws281x";
import Color from "color";

import ws281x from 'rpi-ws281x-native';

// https://www.raspberrypi.org/forums/viewtopic.php?t=233874
export default class Driver {
	constructor(leds, gpio, hardware_brightness) {
		this.config = {};
		this.config.leds = leds;
		// this.config.dma = 10;
		// if (hardware_brightness > 255) hardware_brightness = 255;
		// else if (hardware_brightness < 1) hardware_brightness = 1;
		// this.config.brightness = hardware_brightness; // 255 = max
		// this.config.gpio = gpio;
		// this.config.type = Types.GRB; // GRB
		console.log({ config: this.config });
		// ws281x.configure(this.config);
		ws281x.init(leds);
		this.leds = new Uint32Array(leds);
		this.brightness = 50; // 0-100

		// ws281x.setBrightness(Math.floor((this.brightness * 255) / 100));
		
		ws281x.setBrightness(Math.floor((this.brightness * 255) / 100));

		this.switch_rg = true;
	}

	getColor(r, g, b) {
		// console.log({r,g,b});

		if(this.switch_rg){
			let temp = r;
			r = g;
			g = temp;
		}

		let c = Color({r, g, b});//.lightness(Math.ceil((this.brightness * 50) / 100));
		//c = Color({r: Math.floor(c.rgb().object().r), g: Math.floor(c.rgb().object().g), b: Math.floor(c.rgb().object().b)});
		//console.log({rgb: c.rgb().object(), l: Math.ceil((this.brightness * 50) / 100), br: this.brightness});
		return c.rgbNumber();
		
		// console.log({r,g,b});
		//console.log(hsl);
		//console.log({h1: parseInt(color.hslToHex(hsl).replace('#',''), 16), h2: (r << 16) | (g << 8) | b});
		// let color = Color({ r, g, b }).luminosity(this.brightness / 100.0);
		// console.log({ r: Math.floor((r * this.brightness) / 100), g: Math.floor((g * this.brightness) / 100), b: Math.floor((b * this.brightness) / 100) });
		// return Color({ r: Math.floor((r * this.brightness) / 100), g: Math.floor((g * this.brightness) / 100), b: Math.floor((b * this.brightness) / 100) }).rgbNumber();
		// return (r << 16) | (g << 8) | b;
	}

	setLeds(r, g, b) {
		//console.log({r,g,b});
		let color = this.getColor(r, g, b);
		for (let i = 0; i < this.config.leds; i++) {
			this.leds[i] = color;
		}
	}

	setLed(index, r, g, b) {
		if (index >= 0 && index < this.config.leds) {
			this.leds[index] = this.getColor(r, g, b);
		}
	}

	render() {
		ws281x.render(this.leds);
	}

	off() {
		for (let i = 0; i < this.config.leds; i++) {
			this.leds[i] = 0;
		}
		this.render();
	}

	getLeds() {
		this.config.leds;
	}

	setBrightness(percent) {
		let br = percent; //Number.parseInt(255 * (percent / 100));
		if (br < 0) br = 0;
		else if (br > 100) br = 100;
		this.brightness = br;

		// this.config.brightness = Math.floor((this.brightness * 100) / 255);
		// for (let i = 0; i < this.leds.length; i++) {
		// 	try{
		// 	this.leds[i] = Color("#" + this.leds[i].toString(16))
		// 		.value(this.brightness)
		// 		.rgbNumber();
		// 	} catch(err){
		// 		console.warn(err);
		// 	}
		// }

		ws281x.setBrightness(Math.floor((this.brightness * 255) / 100));

		// ws281x.reset();
		// ws281x.configure(this.config);
	}
}

class Types {
	static RGB = "rgb";
	static RBG = "rbg";
	static GRB = "grb";
	static GBR = "gbr";
	static BGR = "bgr";
	static BRG = "brg";
}
