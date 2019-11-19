import Vue from "../src/index.js";

describe('Lifecycle', function () {
	const cb = jasmine.createSpy('cb')
	it('Mounted', function () {
		const vm = new Vue({
			mounted() {
				cb()
			},
			render(h) {
				return h('div', null, 'hello' /* string as children */)
			}
		}).$mount()
		expect(cb).toHaveBeenCalled()
	});
});