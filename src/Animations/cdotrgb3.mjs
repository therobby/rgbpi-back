import Color from "color";

export default class CDotRGB3 {
	static data() {
		return {
			name: LANG.cdotrgb3.name,
			desc: LANG.cdotrgb3.desc,
			s_name: "cdotrgb3",
            direction_change: true,
            color_change: false,
            leds_change: true,
            rotation_change: true
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.current_rgb = Color({ r: 255, g: 0, b: 0 });
        this.direction = 1; // (1)right = 0->inf | (0)left = inf->0
        this.rotation = 1;
		this.running = false;
		this.leds = 30;
		this.strip = [];
        this.rotation = 1;
        this.class = CDotRGB3;
	}

	setData(data) {
		if (data) {
			if (data.leds && Number(data.leds) != Number.NaN && Number(data.leds) > 0 && Number(data.leds) < this.controller.driver.interface.leds) {
                this.leds = Number(data.leds);
            }
            if(data.rotation){
                if(Number(data.rotation) != Number.NaN && Number(data.rotation) > 0 && Number(data.rotation) < 360){
                    this.rotation = Number(data.rotation);
                }
            }
            if(data.direction){
                if(this.direction != 0){
                    this.direction = 0;
                    this.head -= this.leds;
                    if(this.head < 0){
                        this.head = this.controller.driver.interface.leds + this.head - 1;
                    }
                } else{
                    this.direction = 1;
                    this.head += this.leds;
                    if(this.head >= this.controller.driver.interface.leds){
                        this.head = this.controller.driver.interface.leds - this.head - 1;
                    }
                }
            }
		}
	}

	start() {
        if (this.leds >= this.controller.driver.interface.leds) this.leds = 1;
        
		this.running = true;
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
		this.current_rgb.lightness(50);
		this.current_rgb.saturationl(100);

		// console.log({rgb:looper.rgb});
		// console.log({hsv});

		// console.log({hsv2:hsv});

		if (this.head >= this.controller.driver.interface.leds) {
			this.head = 0;
		} else if (this.head < 0) {
			this.head = this.controller.driver.interface.leds - 1;
		}

		if (this.direction === 0) {
			this.head--;
		} else {
			this.head++;
        }
        
        this.updateStrip();

        this.current_rgb = this.current_rgb.rotate(this.rotation);

        
		if (this.running) {
			this.controller.setColors(this.strip);
		}
    }
    
    updateStrip(){
        for(let i = 0; i < this.leds; i++){
            if(this.direction === 0){
                if(this.head - i < 0){
                    this.strip[this.controller.driver.interface.leds - this.head - i] = this.current_rgb.rgb().object();
                } else {
                    this.strip[this.head - i] = this.current_rgb.rgb().object();
                }
            } else {
                if(this.head + i >= this.controller.driver.interface.leds){
                    this.strip[this.head + i - this.controller.driver.interface.leds] = this.current_rgb.rgb().object();
                } else {
                    this.strip[this.head + i] = this.current_rgb.rgb().object();
                }
                
            }
        }
    }
}
