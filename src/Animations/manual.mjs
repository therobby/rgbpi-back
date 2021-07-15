import Color from "color";

export default class Manual{
	static data() {
		return {
			name: LANG.manual.name,
			desc: LANG.manual.desc,
			s_name: "manual",
            direction_change: false,
            color_change: true,
            leds_change: false,
            rotation_change: false
            // CUSTOM!
		};
	}

	constructor(controller) {
		this.controller = controller;
		this.running = false;
        this.strip = [];
        this.update = false;
        this.class = Manual;
        this.index = -1;
	}

	setData(data) {
		if(data){
            if(data.color){
                this.color = Color({r: data.color.r, g: data.color.g, b: data.color.b});
            }
            if(data.index){
                if(Number.isInteger(data.index)){
                    this.index = data.index;
                }
            } else {
                this.index = -1;
            }
            this.update = true;
		}
	}

	start() {
		this.running = true;
		for (let i = 0; i < this.controller.driver.interface.leds; i++) {
			this.strip.push({r:0, g:0, b:0});
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

        // console.log({color: this.color, index: this.index, update: this.update});
        if(this.update){
            this.update = false;
            if(this.index > 0){
                this.strip[this.index] = this.color.rgb().object();
            } else {
                for (let i = 0; i < this.controller.driver.interface.leds; i++) {
                    this.strip[i] = this.color.rgb().object();
                }
            }
        }
		if (this.running) this.controller.setColors(this.strip);
	}
}
