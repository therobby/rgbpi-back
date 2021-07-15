import Color from "color";

export default class Flash {
	static data() {
		return {
			name: LANG.flash.name,
			desc: LANG.flash.desc,
            s_name: "flash",
            direction_change: false,
            color_change: true,
            leds_change: false,
            rotation_change: false
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.color = Color({ r: 255, g: 0, b: 0 });
		this.running = false;
        this.strip = [];
        this.strip_black = [];
        this.class = Flash;
        this.display = false;
    }

	setData(data) {
		if (data) {
            if (data.color && Number(data.color.r) != Number.NaN && Number(data.color.g) != Number.NaN && Number(data.color.b) != Number.NaN) {
                this.color = Color({r: Number(data.color.r), g: Number(data.color.g), b: Number(data.color.b)});
                this.remakeStrip();
			}
		}
	}

	start() {
		if (this.leds >= this.controller.driver.interface.leds) this.leds = 1;
		this.remakeStrip();
        this.running = true;
        
        for (let i = 0; i < this.controller.driver.interface.leds; i++) {
            this.strip_black.push(Color({ r: 0, g: 0, b: 0 }).rgb().object());
        }
    
		// controller.driver.allRGB({ r: 0, g: 0, b: 0 });
		// controller.driver.setRGB(this.current_location, this.current_rgb);
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
		this.running = false;
	}

	animation() {

        if(this.display){
            this.display = !this.display;
            if (this.running) {
                this.controller.setColors(this.strip);
            }
        } else {
            this.display = !this.display;
            if (this.running) {
                this.controller.setColors(this.strip_black);
            }
        }
    }

	remakeStrip() {
        this.strip = [];

		for (let i = 0; i < this.controller.driver.interface.leds; i++) {
            this.strip.push(this.color.rgb().object());
        }
        
	}
}
