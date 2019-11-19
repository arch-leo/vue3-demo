import Vue from "../src/index.js";

describe('Demo', function () {
	afterEach(() => {
		document.body.appendChild(document.createElement('br'))
		document.body.appendChild(document.createElement('br'))
		document.body.appendChild(document.createElement('br'))
	})

	it('Basic', function () {
		const title = document.createElement('h2')
		title.textContent = 'Basic demo'
		document.body.appendChild(title)
		const vm = new Vue({
			data() {
				return {
					a: {
						b: 0
					},
					c: {}
				}
			},
			render(h) {
				return h('button', {
					on: {
						'click': this.handleClick
					}
				}, '点击按钮 - ' + this.a.b + ' - ' + this.c.d)
			},
			methods: {
				handleClick() {
					this.a.b++
					this.c.d = 3
					setTimeout(() => {
						delete this.a.b
					}, 2000)
				}
			}
		}).$mount()
		document.body.appendChild(vm.$el)
	})
	it('Mvvm in depth', function () {
		const title = document.createElement('h2')
		title.textContent = 'Basic demo'
		document.body.appendChild(title)
		const vm = new Vue({
			data() {
				return {
					a: [{}]
				}
			},
			render(h) {
				return h('div', {}, this.a.map((item, index) => {
					return h('div', {}, [
						h('button', {
							on: {'click': _ => this.setNumber(item)}
						}, 'Set Number'),
						h('button', {
							on: {'click': _ => this.delNumber(item)}
						}, 'Del Number'),
						h('span', {}, item.number),
						h('button', {
							on: {'click': this.appendRow}
						}, 'Append Row'),
						h('button', {
							on: {'click': _ => this.removeRow(index)}
						}, 'Remove Row'),
						h('br', {}, ''),
					])
				}))
			},
			methods: {
				setNumber(item) {
					item.number = Math.random().toFixed(4) * 100
				},
				delNumber(item) {
					delete item.number
				},
				appendRow() {
					this.a.push({})
				},
				removeRow(index) {
					this.a.splice(index, 1)
				},
			}
		}).$mount()
		document.body.appendChild(vm.$el)
	})
});