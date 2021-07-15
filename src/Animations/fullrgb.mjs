import Color from "color";

export default class FullRGB {
	static data() {
		return {
			name: LANG.fullrgb.name,
			desc: LANG.fullrgb.desc,
			s_name: "fullrgb",
            direction_change: false,
            color_change: false,
            leds_change: false,
            rotation_change: true
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.current_rgb = Color({ r: 255, g: 0, b: 0 });
		this.running = false;
		this.rotation = 1;
		this.class = FullRGB;
	}

	setData(data) {
		if(data){
			
            if(data.rotation){
                if(Number(data.rotation) != Number.NaN && Number(data.rotation) > 0 && Number(data.rotation) < 360){
                    this.rotation = Number(data.rotation);
                }
            }
		}
	}

	start() {
		this.running = true;
		this.loop();
	}

	loop() {
		//console.log({ driver, d: controller.drivers[driver] });
		if (this.running) {
			setTimeout(() => {
				this.animation();
				this.loop();
			}, (this.controller.driver.fps / 1000.0) * 100);
		}
	}

	stop() {
		this.running = false;
	}

	animation() {
		this.current_rgb.lightness(50);
		this.current_rgb.saturationl(100);

		this.current_rgb = this.current_rgb.rotate(this.rotation);

		if (this.running) {
			this.controller.setColorAllRGB(this.current_rgb.rgb().object());
		}
	}
}
