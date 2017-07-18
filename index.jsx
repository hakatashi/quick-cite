require('babel-polyfill');

const m = require('mithril');
const keycode = require('keycode');
const {fetch} = require('fetch-ponyfill')();
const qs = require('querystring');

class Store {
	constructor() {
		this.input = '';
		this.bibinfo = '';
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
			this.processData();
		}
	}

	async onPaste() {
		// await next tick
		await new Promise(setTimeout);

		this.processData();
	}

	async processData() {
		const data = await this.fetch();
		if (data === null) {
			return;
		}

		const publisher = data.summary.publisher;
		const publishDate = new Date(data.summary.pubdate);
		const collection = data.onix.DescriptiveDetail.Collection.TitleDetail.TitleElement[0].TitleText.content;
		const title = data.summary.title;
		const author = data.summary.author;

		// eslint-disable-next-line no-irregular-whitespace
		this.bibinfo = `${author}　『${title}』　${publisher}〈${collection}〉、${publishDate.getFullYear()}年。`;
		m.redraw();
	}

	async fetch() {
		const match = this.input.match(/(?:\d-?){10,}/);

		if (match === null) {
			this.isInvalid = true;
			m.redraw();
			return null;
		}

		this.isInvalid = false;

		const isbn = match[0];
		const response = await fetch(`https://api.openbd.jp/v1/get?${qs.encode({isbn})}`, {
			method: 'GET',
			mode: 'cors',
		});

		const data = await response.json();

		return data[0];
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
				<p>
					<textarea
						value={this.store.bibinfo}
					/>
				</p>
			</div>
		);
	}
}

m.mount(document.body, App);
