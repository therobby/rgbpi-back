import Color from "color";

export default class Police {
	static data() {
		return {
			name: LANG.police.name,
			desc: LANG.police.desc,
            s_name: "police",
            direction_change: false,
            color_change: false,
            leds_change: false,
            rotation_change: false
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.running = false;
        this.strip_blue = [];
        this.strip_red = [];
        this.class = Police;
        this.display = false;
    }

	setData(_) {}

	start() {
		if (this.leds >= this.controller.driver.interface.leds) this.leds = 1;
        this.running = true;
        
        for (let i = 0; i < this.controller.driver.interface.leds; i++) {
            this.strip_blue.push(Color({ r: 0, g: 0, b: 255 }).rgb().object());
            this.strip_red.push(Color({ r: 255, g: 0, b: 0 }).rgb().object());
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
                this.controller.setColors(this.strip_blue);
            }
        } else {
            this.display = !this.display;
            if (this.running) {
                this.controller.setColors(this.strip_red);
            }
        }
    }
}
