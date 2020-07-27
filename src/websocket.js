class Websocket {
    constructor() {
        this.socket = window.io.connect(window.location.host);
    }

    getSocket() {
	return this.socket;
    }
}

export default new  Websocket();
