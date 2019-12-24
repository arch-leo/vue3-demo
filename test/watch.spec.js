import Vue from "../src/index.js";

describe('Watch', function () {
	it('Data', done => {
		const cb = jasmine.createSpy('cb')

		const vm = new Vue({
			watch: {
				a(pre, val) {
					cb(pre, val)
				}
			},
			data() {
				return {
					a: 2
				}
			},
		})
		vm.a = 3
		setTimeout(() => {
			expect(cb).toHaveBeenCalledWith(2, 3)
			done()
		}, 0)
	});
	it('Computed', done => {
		const cb = jasmine.createSpy('cb')
		const vm = new Vue({
			watch: {
				b(pre, val) {
					cb(this.b, pre, val)
				}
			},
			computed: {
				b() {
					return this.a + 1
				},
			},
			data() {
				return {
					a: 2
				}
			},
		})
		expect(vm.b).toEqual(3)
		vm.a = 3
		setTimeout(() => {
			expect(cb).toHaveBeenCalledWith(4, 3, 4)
			done()
		}, 0)
	});
	// it('Component', done => {
	// 	const cb = jasmine.createSpy('cb')
	// 	const vm = new Vue({
	// 		data() {
	// 			return {
	// 				msg: 'hello',
	// 			}
	// 		},
	// 		components: {
	// 			'my-com': {
	// 				props: ['msg'],
	// 				watch: {
	// 					txt(pre, val) {
	// 						console.error('txt: 123213')
	// 						cb(pre, val)
	// 					},
	// 					msg(pre, val) {
	// 						console.error('msg: 123213')
	// 						cb(pre, val)
	// 					}
	// 				},
	// 				data() {
	// 					return {
	// 						txt: '哈哈'
	// 					}
	// 				},
	// 				render(h) {
	// 					return h('p', null, this.msg)
	// 				}
	// 			}
	// 		},
	// 		render(h) {
	// 			return h('div', {}, [
	// 				h('my-com', { props: { msg: this.msg } }),
	// 			])
	// 		}
	// 	}).$mount();
	// 	vm.txt = '嘻嘻'
	// 	vm.msg = 'world'
	// 	expect(cb).toHaveBeenCalledWith('hello', 'world')
	// 	document.body.appendChild(vm.$el)
	// });
});