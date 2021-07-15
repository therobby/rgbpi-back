import Color from "color";

export default class TwoPacRGB {
	static data() {
		return {
			name: LANG.twopacrgb.name,
			desc: LANG.twopacrgb.desc,
			s_name: "twopacrgb",
            direction_change: true,
            color_change: false,
            leds_change: true,
            rotation_change: true
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.color = Color({ r: 255, g: 0, b: 0 });
		this.direction = 1; // (1)right = 0->inf | (0)left = inf->0
		this.running = false;
		this.leds = 5;
        this.strip = [];
        this.rotation = 1;
        this.class = TwoPacRGB;
	}

	setData(data) {
		if (data) {
			if (data.leds && Number(data.leds) != Number.NaN && Number(data.leds) > 0 && Number(data.leds) < this.controller.driver.interface.leds) {
                this.leds = Number(data.leds);
                this.remakeStrip();
            }
            if(data.rotation){
                if(Number(data.rotation) != Number.NaN && Number(data.rotation) > 0 && Number(data.rotation) < 360){
                    this.rotation = Number(data.rotation);
                }
            }
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
		if (this.leds >= this.controller.driver.interface.leds) this.leds = 1;
		this.remakeStrip();
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
		this.color.lightness(50);
		this.color.saturationl(100);

        if(this.direction == 1){
            this.strip = [this.strip[this.strip.length - 1], ...this.strip.splice(0, this.strip.length - 1)];
        } else {
            this.strip = [...this.strip.splice(1, this.strip.length), this.strip[0]];;
        }

        this.changeColor();
        this.color = this.color.rotate(this.rotation);
        
		if (this.running) {
			this.controller.setColors(this.strip);
		}


    }
    
    changeColor(){
        for(let i = 0; i < this.strip.length; i++){
            if(this.strip[i].r == 0 && this.strip[i].g == 0 && this.strip[i].b == 0){
                //do nothing
            } else {
                this.strip[i] = this.color.rgb().object();
            }
        }
    }

	remakeStrip() {
        let set_color = true;
        let counter = 0;

		for (let i = 0; i < this.controller.driver.interface.leds; i++) {
            if(set_color){
                this.strip.push(this.color.rgb().object());
            } else {
                this.strip.push(Color({ r: 0, g: 0, b: 0 }).rgb().object());
            }
            if(counter > this.leds){
                counter = 0; 
                if(set_color)
                    set_color = false;
                else
                    set_color = true;
            } else {
                counter++;
            }
        }
	}
}
