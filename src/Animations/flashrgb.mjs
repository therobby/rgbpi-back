import Color from "color";

export default class FlashRGB {
	static data() {
		return {
			name: LANG.flashrgb.name,
			desc: LANG.flashrgb.desc,
            s_name: "flashrgb",
            direction_change: false,
            color_change: false,
            leds_change: false,
            rotation_change: true
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.color = Color({ r: 255, g: 0, b: 0 });
		this.running = false;
        this.strip = [];
        this.strip_black = [];
        this.class = FlashRGB;
        this.display = false;
        this.rotation = 1;
    }

	setData(data) {
		if (data) {
            if(data.rotation){
                if(Number(data.rotation) != Number.NaN && Number(data.rotation) > 0 && Number(data.rotation) < 360){
                    this.rotation = Number(data.rotation);
                }
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
                this.color.rotate(this.rotation);
                this.remakeStrip();
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
