import Vue from "../src/index.js";

describe('Watcher Scheduler', function () {
	it('Watcher Run Once', done => {
		const cb = jasmine.createSpy('cb')
		const vm = new Vue({
			data() {
				return {
					a: 1,
					b: 2
				}
			},
			computed: {
				c() {
					return this.a + this.b
				}
			},
			watch: {
				c() {
					cb()
				}
			}
		})
		vm.a = 10
		vm.b = 11
		setTimeout(() => {
			expect(cb).toHaveBeenCalledTimes(1)
			done()
		}, 0)
	});
	it('Render Once', done => {
		const cb = jasmine.createSpy('cb')
		const vm = new Vue({
			data() {
				return {
					a: 1,
					b: 2
				}
			},
			render(h) {
				cb()
				return h('p', null, this.a + this.b)
			}
		}).$mount()
		expect(cb).toHaveBeenCalledTimes(1)

		vm.a = 10
		vm.b = 11
		setTimeout(() => {
			expect(cb).toHaveBeenCalledTimes(2)
			done()
		}, 0)
	});
});