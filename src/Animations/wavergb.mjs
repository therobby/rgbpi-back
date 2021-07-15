import Color from "color";

export default class WaveRGB {
	static data() {
		return {
			name: LANG.wavergb.name,
			desc: LANG.wavergb.desc,
			s_name: "wavergb",
            direction_change: true,
            color_change: false,
            leds_change: false,
            rotation_change: false
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.running = false;
		this.step = 0;
		this.leds = [];
		this.direction = 1;
        this.class = WaveRGB;
	}

	setData(data) {
		if(data){
            if(data.direction){
                if(this.direction == 0){
                    this.direction = 1;
                } else{
                    this.direction = 0;
                }
            }
		}
	}

	start() {
		this.running = true;
		let count = this.controller.driver.interface.leds;
		this.step = 360 / count;
		this.leds.length = count;
		for (let i = 0; i < this.leds.length; i++) {
			let nrgb = Color({ r: 255, g: 0, b: 0 })
				.rotate(this.step * i)
				.rgb()
				.object();
			this.leds[i] = { r: nrgb.r, g: nrgb.g, b: nrgb.b };
		}
		this.loop();
	}

	loop() {
		if (this.running) {
			setTimeout(() => {
				this.animation();
				this.loop();
			}, (this.controller.driver.fps / 1000.0) * 100);
		}
	}

	stop() {
		console.log(this.running);
		this.running = false;
	}

	animation() {
        if(this.direction == 1){
            this.leds = [this.leds[this.leds.length - 1], ...this.leds.splice(0, this.leds.length - 1)];
        } else {
			// this.strip = [...this.strip.splice(1, this.strip.length), this.strip[0]];
            this.leds = [...this.leds.splice(1, this.leds.length), this.leds[0]];
        }
		// this.leds = [this.leds[this.leds.length - 1], ...this.leds.splice(0, this.leds.length - 1)];

		if (this.running) this.controller.setColors(this.leds);
	}
}
