require('babel-polyfill');

const m = require('mithril');

class Store {
	constructor() {
		this.input = '';
		this.setInput = this.setInput.bind(this);
	}

	async setInput(event) {
		// await next tick
		await new Promise(setTimeout);

		this.input = event.target.value;
		m.redraw();
	}
}

class App {
	constructor() {
		this.store = new Store();
	}

	view() {
		return (
			<div>
				<h1>Quick cite</h1>
				<input
					type="text"
					placeholder="ISBN or Amazon link"
					onpaste={this.store.setInput}
					value={this.store.input}
				/>
			</div>
		);
	}
}

m.mount(document.body, App);
