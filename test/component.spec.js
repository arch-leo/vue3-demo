import Vue from "../src/index.js";

describe('Component', function () {
	it('render vnode with component', function () {
		const vm = new Vue({
			data() {
				return {
					msg1: 'hello',
					msg2: 'world'
				}
			},
			components: {
				'my-com': {
					props: ['msg'],
					render(h) {
						return h('p', null, this.msg)
					}
				}
			},
			render(h) {
				return h('div', {}, [
					h('my-com', { props: { msg: this.msg1 } }),
					h('my-com', { props: { msg: this.msg2 } }),
				])
			}
		}).$mount()
		// document.body.appendChild(vm.$el)
		expect(vm.$el.outerHTML).toEqual('<div><p>hello</p><p>world</p></div>')
	});
	it('component mvvm', done => {
		const vm = new Vue({
			data() {
				return {
					parentMsg: 'hello'
				}
			},
			components: {
				'my-com': {
					props: ['msg'],
					render(h) {
						return h('p', null, this.msg)
					}
				}
			},
			render(h) {
				return h('my-com', { props: { msg: this.parentMsg } })
			}
		}).$mount()
		// document.body.appendChild(vm.$el)
		expect(vm.$el.outerHTML).toEqual('<p>hello</p>')
		vm.parentMsg = 'hi'
		setTimeout(() => {
			expect(vm.$el.outerHTML).toEqual('<p>hi</p>')
			done()
		}, 0)
	});
	it('event && action', function () {
		const cb = jasmine.createSpy('cb')
		const vm = new Vue({
			data() {
				return {
					parentMsg: 'hello'
				}
			},
			components: {
				'my-com': {
					render(h) {
						return h('p', null, this.msg)
					},
					mounted() {
						this.$emit('mounted', { payload: 'payload' })
					}
				}
			},
			render(h) {
				return h('my-com', { on: { mounted: cb } })
			}
		}).$mount()
		// document.body.appendChild(vm.$el)
		expect(cb).withContext(vm)
		expect(cb).toHaveBeenCalledWith({ payload: 'payload' })
	});
	// it('Repeat Render', function () {
	// 	const cb = jasmine.createSpy('cb');

	// 	const vm = new Vue({
	// 		data() {
	// 			return {
	// 				a: 1,
	// 				b: 2,
	// 			}
	// 		},
	// 		render(h) {
	// 			cb()
	// 			return h('p', null, this.a + this.b)
	// 		}
	// 	}).$mount()

	// 	expect(cb).toHaveBeenCalledTimes(1)

	// 	vm.a = 10
	// 	vm.b = 11
	// 	setTimeout(_ => {
	// 		expect(cb).toHaveBeenCalledTimes(2) // change 'a' and 'b' only trigger one render
	// 		// done()
	// 	})
	// })
});