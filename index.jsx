require('babel-polyfill');

const m = require('mithril');
const keycode = require('keycode');
const {fetch} = require('fetch-ponyfill')();
const qs = require('querystring');

class Store {
	constructor() {
		this.input = '';
		this.isInvalid = false;

		this.setInput = this.setInput.bind(this);
		this.onKeydown = this.onKeydown.bind(this);
		this.onPaste = this.onPaste.bind(this);
		this.fetch = this.fetch.bind(this);
	}

	setInput(value) {
		this.input = value;
	}

	onKeydown(event) {
		if (event.which === keycode('enter')) {
			this.fetch();
		}
	}

	async onPaste() {
		// await next tick
		await new Promise(setTimeout);

		this.fetch();
	}

	async fetch() {
		const match = this.input.match(/(?:\d-?){10,}/);

		if (match === null) {
			this.isInvalid = true;
			return;
		}

		this.isInvalid = false;

		const isbn = match[0];
		const response = await fetch(`https://api.openbd.jp/v1/get?${qs.encode({isbn})}`, {
			method: 'GET',
			mode: 'cors',
		});
		console.log(response);

		const data = await response.json();
		console.log(data);
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
					onpaste={this.store.onPaste}
					oninput={m.withAttr('value', this.store.setInput)}
					onkeydown={this.store.onKeydown}
					value={this.store.input}
				/>
				{this.store.isInvalid && (
					<p>input is invalid</p>
				)}
			</div>
		);
	}
}

m.mount(document.body, App);
