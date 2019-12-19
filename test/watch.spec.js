import Vue from "../src/index.js";

describe('Watch', function () {
	it('Data', function () {
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
		expect(cb).toHaveBeenCalledWith(2, 3)
	});
	it('Computed', function () {
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
		expect(cb).toHaveBeenCalledWith(4, 3, 4)
	});
});