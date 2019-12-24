import Vue from "../src/index.js";

describe('Watch data change', function () {
	it('cb is called', done => {
		const cb = jasmine.createSpy('cb')
		const vm = new Vue({
			data() {
				return {
					a: 2
				}
			}
		})
		vm.$watch('a', (pre, val) => {
			cb(pre, val)
		})
		vm.a = 3
		setTimeout(() => {
			expect(cb).toHaveBeenCalledWith(2, 3)
			done()
		}, 0)
	});
});